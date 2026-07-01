import type { Frequency } from "@/types"
import type { SplitTemplateConfig, SplitTemplate } from "./types"

const FULL_BODY: SplitTemplateConfig = {
  id: "FullBody",
  name: "Full Body",
  name_vi: "Toàn thân",
  days: [
    {
      name: "Toàn thân A",
      targetMuscleGroups: ["Chest", "Back", "Quadriceps", "Hamstrings", "Glutes", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Toàn thân B",
      targetMuscleGroups: ["Shoulders", "Trapezius", "Back", "Biceps", "Triceps", "Quadriceps", "Hamstrings", "Glutes"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Toàn thân C",
      targetMuscleGroups: ["Chest", "Shoulders", "Quadriceps", "Hamstrings", "Glutes", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
  ],
}

const UPPER_LOWER: SplitTemplateConfig = {
  id: "UpperLower",
  name: "Upper / Lower",
  name_vi: "Trên / Dưới",
  days: [
    {
      name: "Thân trên A",
      targetMuscleGroups: ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Thân dưới A",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Abductors", "Adductors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Thân trên B",
      targetMuscleGroups: ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Thân dưới B",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Abductors", "Adductors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
  ],
}

const PPL: SplitTemplateConfig = {
  id: "PPL",
  name: "Push / Pull / Legs",
  name_vi: "Đẩy / Kéo / Chân",
  days: [
    {
      name: "Đẩy A",
      targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Kéo A",
      targetMuscleGroups: ["Back", "Biceps", "Forearms"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Chân A",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Abductors", "Adductors", "Hip Flexors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Đẩy B",
      targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Kéo B",
      targetMuscleGroups: ["Back", "Biceps", "Forearms"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Chân A",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Abductors", "Adductors", "Hip Flexors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
  ],
}

const BRO_SPLIT: SplitTemplateConfig = {
  id: "BroSplit",
  name: "Bro Split",
  name_vi: "Chia nhóm cơ",
  days: [
    {
      name: "Ngực + Tay sau",
      targetMuscleGroups: ["Chest", "Triceps"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Lưng + Tay trước",
      targetMuscleGroups: ["Back", "Biceps", "Forearms"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Chân",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
    {
      name: "Vai + Tay",
      targetMuscleGroups: ["Shoulders", "Trapezius", "Biceps", "Triceps"],
      slots: [
        { role: "mainCompound", count: 1 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Chân + Core",
      targetMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Adductors", "Abductors", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 2 },
      ],
    },
  ],
}

const PUSH_PULL: SplitTemplateConfig = {
  id: "PushPull",
  name: "Push / Pull",
  name_vi: "Đẩy / Kéo",
  days: [
    {
      name: "Đẩy A",
      targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Kéo A",
      targetMuscleGroups: ["Back", "Biceps", "Forearms", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Đẩy B",
      targetMuscleGroups: ["Chest", "Shoulders", "Triceps"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
    {
      name: "Kéo B",
      targetMuscleGroups: ["Back", "Biceps", "Forearms", "Abdominals"],
      slots: [
        { role: "mainCompound", count: 2 },
        { role: "secondaryCompound", count: 2 },
        { role: "isolation", count: 3 },
      ],
    },
  ],
}

const TEMPLATES: Record<SplitTemplate, SplitTemplateConfig> = {
  FullBody: FULL_BODY,
  UpperLower: UPPER_LOWER,
  PPL: PPL,
  BroSplit: BRO_SPLIT,
  PushPull: PUSH_PULL,
}

function getTemplateForFrequency(frequency: Frequency): SplitTemplate {
  switch (frequency) {
    case "3 ngày":
      return "FullBody"
    case "4 ngày":
      return "UpperLower"
    case "5 ngày":
      return "BroSplit"
    case "6 ngày":
      return "PPL"
  }
}

export function getTemplate(frequency: Frequency): SplitTemplateConfig {
  const id = getTemplateForFrequency(frequency)
  return TEMPLATES[id]
}

function getAllTemplates(): SplitTemplateConfig[] {
  return Object.values(TEMPLATES)
}

export { TEMPLATES, getTemplateForFrequency }
