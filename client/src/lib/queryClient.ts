import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Interface for enhanced chord verification response
interface ChordVerificationResponse {
  isMatch: boolean;
  targetChord?: {
    id: number;
    name: string;
    rootNote: number;
    scaleDegrees: Record<number, string>;
    inversion: number;
    [key: string]: any; // For any other properties in the ChordData type
  } | null;
}

// Function to verify chord matching via the server API
export async function verifyChordMatch(
  userNotes: string[], 
  targetNotes: string[],
  chordId?: number
): Promise<ChordVerificationResponse> {
  try {
    const response = await apiRequest("POST", "/api/verify-chord", {
      userNotes,
      targetNotes,
      chordId  // Optional chord ID for enhanced verification
    });
    
    const data = await response.json();
    return {
      isMatch: data.isMatch,
      targetChord: data.targetChord
    };
  } catch (error) {
    console.error("Error verifying chord match:", error);
    return { isMatch: false, targetChord: null };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
