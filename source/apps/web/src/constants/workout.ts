export const DURATIONS = ["15 min", "30 min", "45 min", "60+ min"] as const

export const FREQUENCIES = ["3 ngày", "4 ngày", "5 ngày", "6 ngày"] as const

export const MUSCLE_TO_WARMUP_CATEGORY: Record<string, string> = {
  Abdominals: "Core",
  Abductors: "Legs",
  Adductors: "Legs",
  Back: "Back",
  Biceps: "Arms",
  Calves: "Legs",
  Chest: "Chest",
  Forearms: "Arms",
  Glutes: "Legs",
  Hamstrings: "Legs",
  "Hip Flexors": "Legs",
  Quadriceps: "Legs",
  Shins: "Legs",
  Shoulders: "Shoulders",
  Trapezius: "Shoulders",
  Triceps: "Arms",
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
  Cardio: [
    { name_vi: "Bật nhảy tại chỗ", duration: "45s" },
    { name_vi: "Chạy nâng cao đùi", duration: "45s" },
    { name_vi: "Nhảy dây tại chỗ", duration: "30s" },
  ],
}
