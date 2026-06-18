import { MuscleGroup } from "@/types"

export const STORAGE_KEYS = {
  STATE: "nextfit-state",
  THEME: "nextfit-theme",
  EXERCISE_LOGS: "nextfit-exercise-logs",
} as const

export const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"] as const

export const MUSCLE_GROUPS_VI: Record<string, string> = {
  Chest: "Ngực",
  Back: "Lưng",
  Legs: "Chân",
  Shoulders: "Vai",
  Arms: "Tay",
  Core: "Core",
  Abs: "Bụng",
  Cardio: "Tim mạch",
}

export const DURATIONS = ["15 min", "30 min", "45 min", "60+ min"] as const

export const FREQUENCIES = ["3 ngày", "4 ngày", "5 ngày", "6 ngày"] as const

export const EQUIPMENT = [
  "Ab Wheel",
  "Barbell",
  "Battle Ropes",
  "Bodyweight",
  "Cable",
  "Clubbell",
  "Dumbbell",
  "EZ Bar",
  "Gymnastic Rings",
  "Kettlebell",
  "Medicine Ball",
  "Miniband",
  "Parallette Bars",
  "Pull Up Bar",
  "Resistance Band",
  "Sliders",
  "Stability Ball",
  "Suspension Trainer",
  "Weight Plate",
] as const

export const EQUIPMENT_VI: Record<string, string> = {
  "Ab Wheel": "Bánh xe tập bụng",
  Barbell: "Thanh tạ đòn",
  "Battle Ropes": "Dây thừng chiến",
  Bodyweight: "Trọng lượng cơ thể",
  Cable: "Máy cáp",
  Clubbell: "Tạ chùy",
  Dumbbell: "Tạ đơn",
  "EZ Bar": "Thanh EZ",
  "Gymnastic Rings": "Vòng treo",
  Kettlebell: "Tạ ấm",
  "Medicine Ball": "Bóng thuốc",
  Miniband: "Dây kháng lực nhỏ",
  "Parallette Bars": "Xà parallette",
  "Pull Up Bar": "Xà đơn",
  "Resistance Band": "Dây kháng lực",
  Sliders: "Đĩa trượt",
  "Stability Ball": "Bóng ổn định",
  "Suspension Trainer": "Dây treo (TRX)",
  "Weight Plate": "Đĩa tạ",
}

export const DYNAMIC_STRETCHES: Record<string, { name_vi: string; duration: string }[]> = {
  Chest: [
    { name_vi: "Mở ngực (Chest Opener)", duration: "30s" },
    { name_vi: "Xoay vai ra sau", duration: "30s" },
    { name_vi: "Duỗi ngực với tay", duration: "30s" },
  ],
  Back: [
    { name_vi: "Cat-Cow", duration: "30s" },
    { name_vi: "Xoay thân (Torso Twist)", duration: "30s" },
    { name_vi: "Duỗi lưng (Child Pose)", duration: "30s" },
  ],
  Legs: [
    { name_vi: "Đu đưa chân (Leg Swings)", duration: "30s" },
    { name_vi: "Gập duỗi gối (Bodyweight Squat)", duration: "30s" },
    { name_vi: "Chạm mũi chân (Toe Touch)", duration: "30s" },
  ],
  Shoulders: [
    { name_vi: "Xoay vai vòng tròn", duration: "30s" },
    { name_vi: "Duỗi vai qua đầu", duration: "30s" },
    { name_vi: "Xoay cánh tay chữ T", duration: "30s" },
  ],
  Arms: [
    { name_vi: "Xoay cổ tay", duration: "30s" },
    { name_vi: "Duỗi tay trước (Wrist Flexor)", duration: "30s" },
    { name_vi: "Duỗi cơ tam đầu", duration: "30s" },
  ],
  Core: [
    { name_vi: "Cat-Cow", duration: "30s" },
    { name_vi: "Bird-Dog", duration: "30s" },
    { name_vi: "Dead Bug", duration: "30s" },
  ],
  Abs: [
    { name_vi: "Cat-Cow", duration: "30s" },
    { name_vi: "Bird-Dog", duration: "30s" },
    { name_vi: "Dead Bug", duration: "30s" },
  ],
  Cardio: [
    { name_vi: "Bật nhảy tại chỗ", duration: "45s" },
    { name_vi: "Chạy nâng cao đùi", duration: "45s" },
    { name_vi: "Nhảy dây tại chỗ", duration: "30s" },
  ],
}

export const POPULAR_EQUIPMENT: Set<string> = new Set([
  "Bodyweight",
  "Dumbbell",
  "Barbell",
  "Kettlebell",
  "Resistance Band",
])
