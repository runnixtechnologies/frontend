"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "../_components/dashboard-layout"
import {
  DeliveryFilters,
  type DeliveryFilterValues,
} from "./_components/filters"
import { DeliveryStats } from "./_components/stats"
import { DeliveryTable } from "./_components/table"
import { DeliveryTabs } from "./_components/tabs"

export interface Delivery {
  id: number
  date: string
  time: string
  userName: string
  deliveryType: string
  fee: string
  riderName: string
  riderPhone?: string
  riderImage?: string
  pickupPoint: string
  destination: string
  duration: string
  status: string
  items?: {
    name: string
    img?: string
    price: string
    quantity: number
    selections?: string[]
  }[]
  trackingId?: string
  deliveryService?: {
    name: string
    type: string
    fee: string
  }
}

const deliveries: Delivery[] = [
  {
    id: 1,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "James Saturn",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "James Saturn",
    riderPhone: "08036346688",
    riderImage: "/placeholder.svg?height=50&width=50",
    pickupPoint: "Chicken Republic, 51 Irele-Ilaje Road, Irele, Osun",
    destination: "111 Modakeke-Ife Road, Modakeke, Osun",
    duration: "45 mins",
    status: "pending",
    items: [
      {
        name: "Jollof Rice + Beef",
        img: "/jollof-rice.png",
        price: "₦10,240",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 2,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Oliver Church",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "Dillan Collins",
    pickupPoint: "199 Bird Avenue, Strood, SA86 1BT",
    destination: "344 Bag Close, Brierly Hill, SW84 8NP",
    duration: "45 mins",
    status: "pending",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "White Rice + Chiken",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 3,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Neco Jenkins",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "Fred Velasquez",
    pickupPoint: "297 Fuzzy Lane, Longport, YO63 5SP",
    destination: "300 Invention Road, Pewsey, CW79 1E",
    duration: "45 mins",
    status: "completed",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 4,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Ross Small",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "Darien Cox",
    pickupPoint: "41 Bath Crescent, Ferryside, SP4 5WC",
    destination: "274 Spurious Crescent, Conningha...",
    duration: "45 mins",
    status: "in-transit",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/jollof-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 5,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Strachan White",
    deliveryType: "send",
    fee: "₦ 5,200",
    riderName: "Aliekber Barrett",
    pickupPoint: "383 Enchanted Street, Stallingborough, EC5...",
    destination: "153 Two Avenue, Dodwich, HS22 6SN",
    duration: "45 mins",
    status: "cancelled",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/jollof-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 6,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Zeek Kirk",
    deliveryType: "send",
    fee: "₦ 5,200",
    riderName: "Ryo Farley",
    pickupPoint: "107 Guide Avenue, Unstone, TD6 8GL",
    destination: "390 Five Street, Kings Sutton, LA33 6NW",
    duration: "45 mins",
    status: "completed",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 7,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Raithin Mccarthy",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "Jamaal Wheeler",
    pickupPoint: "262 Earthy Lane, Southgate, MK30 6BH",
    destination: "413 Horses Road, Smethwick, NG26 1BN",
    duration: "45 mins",
    status: "pending",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 8,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Benjamin Wilcox",
    deliveryType: "send",
    fee: "₦ 5,200",
    riderName: "Brehme Johns",
    pickupPoint: "323 Toothpaste Road, Milnthorpe, LN66 5BS",
    destination: "63 Tedious Street, Avonmouth, IV27 5TQ",
    duration: "45 mins",
    status: "in-transit",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 9,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Chad Camacho",
    deliveryType: "send",
    fee: "₦ 5,200",
    riderName: "Devlin Anderson",
    pickupPoint: "217 Chop Road, Chelmsford, WN75 7...",
    destination: "480 Full Road, Bournemouth, CM91...",
    duration: "45 mins",
    status: "cancelled",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 10,
    date: "Sat 15, Aug",
    time: "4:30 PM",
    userName: "Haiden Blake",
    deliveryType: "receive",
    fee: "₦ 5,200",
    riderName: "Darrel Fields",
    pickupPoint: "327 Hand Avenue, Ruabon, CV23 7GL",
    destination: "361 Country Crescent, Bulkington, HD8 3DG",
    duration: "45 mins",
    status: "completed",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 11,
    date: "Sat 15, Aug",
    time: "5:15 PM",
    userName: "Liam Johnson",
    deliveryType: "receive",
    fee: "₦ 4,800",
    riderName: "Marcus Wright",
    pickupPoint: "128 Maple Street, Northampton, NP45 2TY",
    destination: "356 Oak Avenue, Birmingham, BM21 7KL",
    duration: "35 mins",
    status: "in-transit",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 12,
    date: "Sat 15, Aug",
    time: "5:30 PM",
    userName: "Emma Thompson",
    deliveryType: "send",
    fee: "₦ 3,500",
    riderName: "Daniel Brown",
    pickupPoint: "45 Pine Road, Liverpool, LP67 9QR",
    destination: "89 Cedar Lane, Manchester, MC34 5ZX",
    duration: "25 mins",
    status: "pending",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 13,
    date: "Sat 15, Aug",
    time: "5:45 PM",
    userName: "Noah Wilson",
    deliveryType: "send",
    fee: "₦ 7,200",
    riderName: "Sophia Davis",
    pickupPoint: "72 Elm Street, Glasgow, GL12 8VB",
    destination: "103 Birch Road, Edinburgh, ED56 3NM",
    duration: "50 mins",
    status: "completed",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 14,
    date: "Sat 15, Aug",
    time: "6:00 PM",
    userName: "Olivia Martin",
    deliveryType: "receive",
    fee: "₦ 6,100",
    riderName: "James Wilson",
    pickupPoint: "215 Willow Lane, Cardiff, CF78 1PQ",
    destination: "330 Spruce Avenue, Bristol, BR45 6ST",
    duration: "40 mins",
    status: "in-transit",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 15,
    date: "Sat 15, Aug",
    time: "6:15 PM",
    userName: "William Taylor",
    deliveryType: "send",
    fee: "₦ 4,300",
    riderName: "Ava Johnson",
    pickupPoint: "58 Aspen Road, Leeds, LD23 7YU",
    destination: "91 Redwood Street, Sheffield, SH67 2WE",
    duration: "30 mins",
    status: "cancelled",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 16,
    date: "Sat 15, Aug",
    time: "6:30 PM",
    userName: "Sophia Anderson",
    deliveryType: "send",
    fee: "₦ 8,500",
    riderName: "Ethan Brown",
    pickupPoint: "147 Magnolia Avenue, Newcastle, NC89 4RT",
    destination: "263 Sycamore Road, Nottingham, NT12 5HJ",
    duration: "55 mins",
    status: "completed",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 17,
    date: "Sat 15, Aug",
    time: "6:45 PM",
    userName: "Mason Clark",
    deliveryType: "receive",
    fee: "₦ 5,700",
    riderName: "Isabella White",
    pickupPoint: "82 Juniper Lane, Leicester, LC34 9KL",
    destination: "119 Poplar Street, Coventry, CV56 1MN",
    duration: "45 mins",
    status: "pending",
    items: [
      {
        name: "Jollof Rice + Beef",
        price: "₦10,240",
        img: "/white-rice.png",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 18,
    date: "Sat 15, Aug",
    time: "7:00 PM",
    userName: "Charlotte Lewis",
    deliveryType: "send",
    fee: "₦ 3,900",
    riderName: "Michael Harris",
    pickupPoint: "36 Cypress Road, Southampton, SO78 2OP",
    destination: "74 Beech Avenue, Portsmouth, PO45 6QR",
    duration: "30 mins",
    status: "in-transit",
    items: [
      {
        name: "Jollof Rice + Beef",
        img: "/jollof-rice.png",
        price: "₦10,240",
        quantity: 2,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
      {
        name: "Jollof Rice + Beef",
        price: "₦5,120",
        img: "/white-rice.png",
        quantity: 1,
        selections: ["Big Pack", "Plantain", "Ponmo"],
      },
    ],
    trackingId: "RN422G4342D43",
    deliveryService: {
      name: "Runnix Bike",
      type: "Express Delivery",
      fee: "₦2,000",
    },
  },
  {
    id: 19,
    date: "Sat 15, Aug",
    time: "7:15 PM",
    userName: "Elijah Walker",
    deliveryType: "send",
    fee: "₦ 9,200",
    riderName: "Amelia King",
    pickupPoint: "195 Hemlock Street, Oxford, OX23 7ST",
    destination: "241 Fir Lane, Cambridge, CB56 1UV",
    duration: "60 mins",
    status: "cancelled",
  },
  {
    id: 20,
    date: "Sat 15, Aug",
    time: "7:30 PM",
    userName: "Mia Green",
    deliveryType: "receive",
    fee: "₦ 6,400",
    riderName: "Benjamin Hall",
    pickupPoint: "63 Alder Road, York, YK12 8WX",
    destination: "108 Cedar Street, Durham, DH45 3YZ",
    duration: "40 mins",
    status: "completed",
  },
]

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState("in-transit")
  const [filtered, setFiltered] = useState<Delivery[]>(deliveries)
  const itemsPerPage = 10

  const [tabCounts, setTabCounts] = useState({
    all: deliveries.length,
    "in-transit": 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  })

  // Calculate counts for each tab
  useEffect(() => {
    const counts = {
      all: deliveries.length,
      "in-transit": deliveries.filter((d) => d.status === "in-transit").length,
      pending: deliveries.filter((d) => d.status === "pending").length,
      completed: deliveries.filter((d) => d.status === "completed").length,
      cancelled: deliveries.filter((d) => d.status === "cancelled").length,
    }
    setTabCounts(counts)
  }, [])

  const [filters, setFilters] = useState<DeliveryFilterValues>({
    type: "all-type",
    location: "all-locations",
    status: [],
    dateRange: "all-time",
    searchQuery: "",
  })

  // -- apply filters & recalc pagination
  useEffect(() => {
    let result = [...deliveries]

    if (filters) {
      const { type, location, status, searchQuery } = filters

      if (type !== "all-type") {
        const typeMap: Record<string, string> = {
          send: "send",
          receive: "receive",
        }
        const lookup = typeMap[type] || ""
        result = result.filter((d) => d.deliveryType === lookup)
      }

      if (location !== "all-locations") {
        const locMap: Record<string, number[]> = {
          north: [1, 5, 9, 13, 17, 21, 25, 29],
          south: [2, 6, 10, 14, 18, 22, 26, 30],
          east: [3, 7, 11, 15, 19, 23, 27],
          west: [4, 8, 12, 16, 20, 24, 28],
        }
        result = result.filter((d) => locMap[location]?.includes(d.id))
      }

      if (status.length > 0) {
        result = result.filter((d) => status.includes(d.status))
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        result = result.filter(
          (d) =>
            d.userName.toLowerCase().includes(q) ||
            d.riderName.toLowerCase().includes(q) ||
            d.pickupPoint.toLowerCase().includes(q) ||
            d.destination.toLowerCase().includes(q)
        )
      }

      // dateRange logic here...
    }

    setFiltered(result)
  }, [filters, itemsPerPage])

  const handleFilterChange = (newFilters: DeliveryFilterValues) => {
    const statusMap: Record<string, string> = {
      "in-transit": "in-transit",
      pending: "pending",
      completed: "completed",
      cancelled: "cancelled",
    }

    // If tab changes, update the status filter
    if (statusMap[activeTab]) {
      newFilters = {
        ...newFilters,
        status: [statusMap[activeTab]],
      }
    }
    setFilters(newFilters)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Update filters based on the selected tab
    const statusMap: Record<string, string> = {
      "in-transit": "in-transit",
      pending: "pending",
      completed: "completed",
      cancelled: "cancelled",
    }

    if (statusMap[tab]) {
      setFilters((prev) => ({
        ...prev,
        status: [statusMap[tab]],
      }))
    } else {
      // If "All" tab, clear status filter
      setFilters((prev) => ({
        ...prev,
        status: [],
      }))
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <DeliveryStats />
        <div className="w-full bg-white  rounded-lg border flex flex-col gap-3 ">
          <div className="w-full flex justify-between gap-2 pt-6 pb-5 px-6">
            <DeliveryTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              size={filtered?.length}
              tabCounts={tabCounts}
            />
            <DeliveryFilters onFilterChange={handleFilterChange} />
          </div>
          <DeliveryTable filters={filters} deliveries={deliveries} />
        </div>
      </div>
    </DashboardLayout>
  )
}
