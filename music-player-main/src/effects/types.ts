export interface AnimationEffect {
  id: string;
  name: string;
  description?: string;
  animate: (element: HTMLElement, duration?: number) => void;
}

export interface StyleVariation {
  id: string;
  name: string;
  description?: string;
  className: string;
}
