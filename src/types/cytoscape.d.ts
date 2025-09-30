declare module 'cytoscape' {
  interface Core {
    nodes(): any;
    edges(): any;
    on(event: string, handler: (event: any) => void): void;
    on(event: string, selector: string, handler: (event: any) => void): void;
    zoom(): number;
    zoom(level: number): void;
    fit(): void;
    destroy(): void;
  }

  interface CytoscapeOptions {
    container: HTMLElement;
    elements: any[];
    style: any[];
    layout: any;
  }

  function cytoscape(options: CytoscapeOptions): Core;
  export = cytoscape;
}
