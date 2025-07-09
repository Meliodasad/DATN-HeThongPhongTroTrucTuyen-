// src/types/PhongTro.ts
export interface PhongTro {
  id: string;
  tieu_de: string;
  dia_chi: string;
  gia_thue: number;
  dien_tich: number;
  mo_ta: string;
  hinh_anh: string[];
  trang_thai: "con_trong" | "da_thue";
  chu_tro_id: number;
}
