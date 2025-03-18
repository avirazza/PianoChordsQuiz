// Type definitions for Web MIDI API
declare namespace WebMidi {
  interface MIDIOptions {
    sysex?: boolean;
    software?: boolean;
  }

  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
    sysexEnabled: boolean;
  }

  interface MIDIInputMap {
    size: number;
    entries(): IterableIterator<[string, MIDIInput]>;
    forEach(callback: (input: MIDIInput, id: string, map: MIDIInputMap) => void): void;
    get(id: string): MIDIInput | undefined;
    has(id: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIInput>;
  }

  interface MIDIOutputMap {
    size: number;
    entries(): IterableIterator<[string, MIDIOutput]>;
    forEach(callback: (output: MIDIOutput, id: string, map: MIDIOutputMap) => void): void;
    get(id: string): MIDIOutput | undefined;
    has(id: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIOutput>;
  }

  interface MIDIPort extends EventTarget {
    connection: 'open' | 'closed' | 'pending';
    id: string;
    manufacturer?: string;
    name?: string;
    state: 'connected' | 'disconnected';
    type: 'input' | 'output';
    version?: string;
    onstatechange: ((event: MIDIConnectionEvent) => void) | null;
    close(): Promise<MIDIPort>;
    open(): Promise<MIDIPort>;
  }

  interface MIDIInput extends MIDIPort {
    type: 'input';
    onmidimessage: ((event: MIDIMessageEvent) => void) | null;
  }

  interface MIDIOutput extends MIDIPort {
    type: 'output';
    send(data: Uint8Array | number[], timestamp?: DOMHighResTimeStamp): void;
    clear(): void;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
  }
}

interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}