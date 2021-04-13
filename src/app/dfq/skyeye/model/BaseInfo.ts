export class PlantInfo {
  site: string;
  plants: {};
}
export class LineInfo {
  name: string;
  sections: {};
}

export class SectionClass {
  name: string;
  id: number;
  lines: {};
}

export class LineClass {
  id: number;
  name: string;
  machines: {};
}

export class MachineClass {
  name: string;
  desc: string;
  evt_dt: number;
  status: string;
}
