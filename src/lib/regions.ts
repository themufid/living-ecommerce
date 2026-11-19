export type RegionCity = {
  name: string
  districts: string[]
}

export type Region = {
  province: string
  zone: 1 | 2 | 3
  cities: RegionCity[]
}

export const regions: Region[] = [
  {
    province: "DKI Jakarta",
    zone: 1,
    cities: [
      { name: "Jakarta Selatan", districts: ["Kebayoran Baru", "Cilandak", "Setiabudi", "Kebayoran Lama"] },
      { name: "Jakarta Pusat", districts: ["Menteng", "Tanah Abang", "Gambir"] },
      { name: "Jakarta Barat", districts: ["Kebon Jeruk", "Palmerah", "Grogol Petamburan"] },
      { name: "Jakarta Utara", districts: ["Kelapa Gading", "Pademangan", "Penjaringan"] },
    ],
  },
  {
    province: "Banten",
    zone: 1,
    cities: [
      { name: "Tangerang Selatan", districts: ["Serpong", "Ciputat", "Pondok Aren"] },
      { name: "Tangerang", districts: ["Karawaci", "Tangerang", "Batuceper"] },
    ],
  },
  {
    province: "Jawa Barat",
    zone: 1,
    cities: [
      { name: "Bandung", districts: ["Coblong", "Bandung Wetan", "Sukajadi"] },
      { name: "Bekasi", districts: ["Bekasi Selatan", "Bekasi Timur", "Medan Satria"] },
      { name: "Bogor", districts: ["Bogor Tengah", "Bogor Utara", "Tanah Sareal"] },
      { name: "Depok", districts: ["Pancoran Mas", "Beji", "Cimanggis"] },
    ],
  },
  {
    province: "Jawa Tengah",
    zone: 2,
    cities: [
      { name: "Semarang", districts: ["Semarang Tengah", "Candisari", "Banyumanik"] },
      { name: "Surakarta", districts: ["Laweyan", "Banjarsari", "Pasar Kliwon"] },
    ],
  },
  {
    province: "DI Yogyakarta",
    zone: 2,
    cities: [{ name: "Yogyakarta", districts: ["Gondokusuman", "Jetis", "Umbulharjo"] }],
  },
  {
    province: "Jawa Timur",
    zone: 2,
    cities: [
      { name: "Surabaya", districts: ["Genteng", "Gubeng", "Tegalsari"] },
      { name: "Malang", districts: ["Klojen", "Lowokwaru", "Sukun"] },
    ],
  },
  {
    province: "Bali",
    zone: 3,
    cities: [
      { name: "Denpasar", districts: ["Denpasar Selatan", "Denpasar Barat", "Denpasar Timur"] },
      { name: "Badung", districts: ["Kuta", "Kuta Utara", "Mengwi"] },
    ],
  },
  {
    province: "Sumatera Utara",
    zone: 3,
    cities: [{ name: "Medan", districts: ["Medan Petisah", "Medan Baru", "Medan Polonia"] }],
  },
  {
    province: "Sumatera Selatan",
    zone: 3,
    cities: [{ name: "Palembang", districts: ["Ilir Timur I", "Ilir Barat I", "Sukarami"] }],
  },
  {
    province: "Sulawesi Selatan",
    zone: 3,
    cities: [{ name: "Makassar", districts: ["Ujung Pandang", "Panakkukang", "Rappocini"] }],
  },
]

export function citiesOf(province: string) {
  return regions.find((region) => region.province === province)?.cities ?? []
}

export function districtsOf(province: string, city: string) {
  return citiesOf(province).find((item) => item.name === city)?.districts ?? []
}

export function zoneOf(province: string) {
  return regions.find((region) => region.province === province)?.zone ?? 2
}
