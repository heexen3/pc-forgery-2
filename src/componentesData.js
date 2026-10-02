const DB_COMPONENTES = {
    procesadores: [
        {
            id: "cpu-amd-7600x",
            plataforma: "AMD",
            socket: "AM5",
            nombre: "AMD Ryzen 5 7600X",
            precio: 245000,
            consumoWatts: 105,
            img: "img/computer.png"
        },
        {
            id: "cpu-amd-7800x3d",
            plataforma: "AMD",
            socket: "AM5",
            nombre: "AMD Ryzen 7 7800X3D",
            precio: 420000,
            consumoWatts: 120,
            img: "img/computer.png"
        },
        {
            id: "cpu-intel-13400f",
            plataforma: "Intel",
            socket: "LGA1700",
            nombre: "Intel Core i5-13400F",
            precio: 185000,
            consumoWatts: 65,
            img: "img/computer2.png"
        },
        {
            id: "cpu-intel-13600k",
            plataforma: "Intel",
            socket: "LGA1700",
            nombre: "Intel Core i5-13600K",
            precio: 310000,
            consumoWatts: 125,
            img: "img/computer2.png"
        }
    ],

    placas: [
        {
            id: "mb-asus-b650-atx",
            plataforma: "AMD",
            socket: "AM5",
            formato: "ATX",
            tipoRam: "DDR5",
            ranurasM2: 3,
            nombre: "ASUS TUF Gaming B650-PLUS WIFI",
            precio: 215000,
            img: "img/computer.png"
        },
        {
            id: "mb-msi-a620m-matx",
            plataforma: "AMD",
            socket: "AM5",
            formato: "Micro-ATX",
            tipoRam: "DDR5",
            ranurasM2: 1,
            nombre: "MSI PRO A620M-E",
            precio: 105000,
            img: "img/computer.png"
        },
        {
            id: "mb-gigabyte-b760-ddr5",
            plataforma: "Intel",
            socket: "LGA1700",
            formato: "ATX",
            tipoRam: "DDR5",
            ranurasM2: 3,
            nombre: "Gigabyte B760 AORUS ELITE AX DDR5",
            precio: 195000,
            img: "img/computer2.png"
        },
        {
            id: "mb-asrock-b760m-ddr4",
            plataforma: "Intel",
            socket: "LGA1700",
            formato: "Micro-ATX",
            tipoRam: "DDR4",
            ranurasM2: 2,
            nombre: "ASRock B760M-HDV/M.2 D4",
            precio: 115000,
            img: "img/computer2.png"
        }
    ],

    ram: [
        {
            id: "ram-kingston-32-ddr5",
            tipo: "DDR5",
            capacidad: "32GB (2x16GB)",
            frecuencia: "6000MHz",
            nombre: "Kingston Fury Beast RGB 32GB DDR5",
            precio: 125000,
            img: "img/computer.png"
        },
        {
            id: "ram-corsair-16-ddr5",
            tipo: "DDR5",
            capacidad: "16GB (2x8GB)",
            frecuencia: "5200MHz",
            nombre: "Corsair Vengeance 16GB DDR5",
            precio: 68000,
            img: "img/computer.png"
        },
        {
            id: "ram-corsair-16-ddr4",
            tipo: "DDR4",
            capacidad: "16GB (2x8GB)",
            frecuencia: "3200MHz",
            nombre: "Corsair Vengeance LPX 16GB DDR4",
            precio: 45000,
            img: "img/computer2.png"
        },
        {
            id: "ram-kingston-32-ddr4",
            tipo: "DDR4",
            capacidad: "32GB (2x16GB)",
            frecuencia: "3200MHz",
            nombre: "Kingston Fury Beast 32GB DDR4",
            precio: 78000,
            img: "img/computer2.png"
        }
    ],

    gpu: [
        {
            id: "gpu-rtx-4060",
            fabricante: "NVIDIA",
            vram: "8GB",
            largoMm: 242,
            consumoWatts: 115,
            fuenteRecomendadaWatts: 550,
            nombre: "MSI GeForce RTX 4060 Ventus 2X",
            precio: 340000,
            img: "img/computer.png"
        },
        {
            id: "gpu-rx-7700xt",
            fabricante: "AMD",
            vram: "12GB",
            largoMm: 280,
            consumoWatts: 245,
            fuenteRecomendadaWatts: 700,
            nombre: "Sapphire Pulse AMD Radeon RX 7700 XT",
            precio: 485000,
            img: "img/computer.png"
        },
        {
            id: "gpu-rtx-4070super",
            fabricante: "NVIDIA",
            vram: "12GB",
            largoMm: 267,
            consumoWatts: 220,
            fuenteRecomendadaWatts: 650,
            nombre: "ASUS Dual GeForce RTX 4070 SUPER",
            precio: 690000,
            img: "img/computer2.png"
        },
        {
            id: "gpu-rx-7800xt",
            fabricante: "AMD",
            vram: "16GB",
            largoMm: 320,
            consumoWatts: 263,
            fuenteRecomendadaWatts: 750,
            nombre: "XFX Speedster QICK 319 Radeon RX 7800 XT",
            precio: 580000,
            img: "img/computer2.png"
        }
    ],

    almacenamiento: [
        {
            id: "ssd-kingston-1tb-nvme",
            interfaz: "M.2 NVMe",
            capacidad: "1TB",
            nombre: "Kingston NV2 1TB PCIe 4.0 NVMe",
            precio: 62000,
            img: "img/computer.png"
        },
        {
            id: "ssd-wd-black-2tb-nvme",
            interfaz: "M.2 NVMe",
            capacidad: "2TB",
            nombre: "WD_BLACK SN850X 2TB PCIe 4.0 NVMe",
            precio: 165000,
            img: "img/computer.png"
        },
        {
            id: "ssd-crucial-500gb-nvme",
            interfaz: "M.2 NVMe",
            capacidad: "500GB",
            nombre: "Crucial P3 Plus 500GB PCIe 4.0 NVMe",
            precio: 42000,
            img: "img/computer2.png"
        },
        {
            id: "ssd-samsung-1tb-sata",
            interfaz: "SATA 2.5",
            capacidad: "1TB",
            nombre: "Samsung 870 EVO 1TB SATA III",
            precio: 75000,
            img: "img/computer2.png"
        }
    ],

    fuentes: [
        {
            id: "psu-corsair-550w",
            potenciaWatts: 550,
            certificacion: "80 Plus Bronze",
            modular: "No Modular",
            nombre: "Corsair CV550 550W 80+ Bronze",
            precio: 48000,
            img: "img/computer.png"
        },
        {
            id: "psu-corsair-650w",
            potenciaWatts: 650,
            certificacion: "80 Plus Bronze",
            modular: "No Modular",
            nombre: "Corsair CV650 650W 80+ Bronze",
            precio: 58000,
            img: "img/computer.png"
        },
        {
            id: "psu-evga-750w",
            potenciaWatts: 750,
            certificacion: "80 Plus Gold",
            modular: "Semi Modular",
            nombre: "EVGA 750 BQ 750W 80+ Bronze",
            precio: 85000,
            img: "img/computer.png"
        },
        {
            id: "psu-msi-850w",
            potenciaWatts: 850,
            certificacion: "80 Plus Gold",
            modular: "Full Modular",
            nombre: "MSI MAG A850GL 850W 80+ Gold PCIe 5.0",
            precio: 125000,
            img: "img/computer2.png"
        }
    ],

    gabinetes: [
        {
            id: "case-deepcool-cc560",
            formatosSoportados: ["ATX", "Micro-ATX", "Mini-ITX"],
            maxLargoGpuMm: 370,
            nombre: "DeepCool CC560 V2 Mid Tower",
            precio: 54000,
            img: "img/computer.png"
        },
        {
            id: "case-cooler-q300l",
            formatosSoportados: ["Micro-ATX", "Mini-ITX"],
            maxLargoGpuMm: 360,
            nombre: "Cooler Master MasterBox Q300L Mini Tower",
            precio: 46000,
            img: "img/computer.png"
        },
        {
            id: "case-nzxt-h5-flow",
            formatosSoportados: ["ATX", "Micro-ATX", "Mini-ITX"],
            maxLargoGpuMm: 365,
            nombre: "NZXT H5 Flow Compact Mid Tower",
            precio: 92000,
            img: "img/computer2.png"
        },
        {
            id: "case-asus-ap201",
            formatosSoportados: ["Micro-ATX", "Mini-ITX"],
            maxLargoGpuMm: 338,
            nombre: "ASUS Prime AP201 Micro-ATX Case",
            precio: 79000,
            img: "img/computer2.png"
        }
    ]
};

export default DB_COMPONENTES;