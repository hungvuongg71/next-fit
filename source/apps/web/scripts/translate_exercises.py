#!/usr/bin/env python3
"""
Translate exercises.json from English to Vietnamese.

Approach:
  1. Dictionary-based: muscles, equipment, categories, levels → Vi
  2. Exercise names: pattern-based + direct mapping
  3. Instructions/descriptions: phrase-based + word-by-word with ~950-word EN→VI dictionary
"""

import json
import os
import re
from collections import OrderedDict

# ━━━━━━━━━━━━ DICTIONARIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MUSCLES_VI = {
    "Abs": "Cơ bụng", "Abductors": "Cơ dạng", "Adductors": "Cơ khép",
    "Back": "Lưng", "Biceps": "Cơ nhị đầu", "Calves": "Cơ bắp chân",
    "Cardiovascular System": "Hệ tim mạch", "Chest": "Cơ ngực",
    "Core": "Cơ trung tâm", "Delts": "Cơ vai", "Deltoids": "Cơ vai",
    "Forearms": "Cơ cẳng tay", "Glutes": "Cơ mông",
    "Hamstrings": "Cơ đùi sau", "Hip Flexors": "Cơ gập hông",
    "Lats": "Cơ xô", "Latissimus Dorsi": "Cơ xô",
    "Levator Scapulae": "Cơ nâng vai", "Lower Back": "Cơ lưng dưới",
    "Obliques": "Cơ chéo bụng", "Pectorals": "Cơ ngực",
    "Quads": "Cơ tứ đầu đùi", "Quadriceps": "Cơ tứ đầu đùi",
    "Rear Deltoids": "Cơ vai sau", "Rhomboids": "Cơ trám",
    "Rotator Cuff": "Cơ xoay vai", "Serratus Anterior": "Cơ răng trước",
    "Shoulders": "Cơ vai", "Soleus": "Cơ dép",
    "Spine": "Cột sống", "Sternocleidomastoid": "Cơ ức đòn chũm",
    "Trapezius": "Cơ thang", "Traps": "Cơ thang",
    "Triceps": "Cơ tam đầu", "Upper Back": "Lưng trên",
    "Abdominals": "Cơ bụng", "Ankle Stabilizers": "Cơ ổn định cổ chân",
    "Ankles": "Cổ chân", "Brachialis": "Cơ cánh tay trước",
    "Feet": "Bàn chân", "Grip Muscles": "Cơ bám tay",
    "Hands": "Bàn tay", "Inner Thighs": "Cơ đùi trong",
    "Lower Abs": "Cơ bụng dưới", "Shins": "Cẳng chân",
    "Upper Chest": "Ngực trên", "Wrist Extensors": "Cơ duỗi cổ tay",
    "Wrist Flexors": "Cơ gập cổ tay", "Wrists": "Cổ tay",
}

EQUIPMENT_VI = {
    "Barbell": "Tạ đòn", "Bench": "Ghế tập", "Bodyweight": "Tự trọng",
    "Cable": "Máy cáp", "Dumbbell": "Tạ đơn", "EZ Curl Bar": "Thanh EZ",
    "Foam Roll": "Con lăn", "Gym mat": "Thảm tập",
    "Incline bench": "Ghế nghiêng", "Kettlebell": "Tạ ấm",
    "Machine": "Máy tập", "Pull-up bar": "Xà đơn",
    "Resistance Band": "Dây kháng lực", "Swiss Ball": "Bóng tập",
}

CATEGORY_VI = {
    "Abs": "Cơ bụng", "Arms": "Cánh tay", "Back": "Lưng",
    "Cardio": "Tim mạch", "Chest": "Ngực", "Legs": "Chân",
    "Shoulders": "Vai",
}

LEVEL_VI = {"Beginner": "Cơ bản", "Intermediate": "Trung cấp", "Advanced": "Nâng cao"}

EXERCISE_NAME_VI = {
    "Upward Facing Dog": "Chó Ngửa",
    "Assisted Hanging Knee Raise": "Nâng Gối Treo Có Hỗ Trợ",
    "Impossible Dips": "Dips Khó",
    "Push-Up Inside Leg Kick": "Chống Đẩy Đá Chân Trong",
    "Cable Cross-Over Variation": "Cáp Chéo Biến Thể",
    "Barbell Seated Bradford Rocky Press": "Đẩy Bradford Ngồi Với Tạ Đòn",
    "Band Underhand Pulldown With Classic": "Kéo Xô Ngược Với Dây",
    "Dumbbell Standing Reverse Curl": "Cuộn Ngược Với Tạ Đơn",
    "One Leg Floor Calf Raise": "Nhón Gót Một Chân Trên Sàn",
    "Dumbbell Burpee": "Burpee Với Tạ Đơn",
    "Roller Hip Lat Stretch": "Căng Cơ Hông Và Xô Với Con Lăn",
    "Weighted Sissy Squat": "Sissy Squat Có Tạ",
    "Runners Stretch": "Căng Cơ Người Chạy",
    "Gentle Style Cable Pulldown (Pro Lat Bar)": "Kéo Xô Nhẹ Nhàng Với Cáp",
    "Inverse Leg Curl (On Pull-Up Cable Machine)": "Gập Đùi Ngược Trên Máy Kéo Xô",
    "Smith Seated One Leg Calf Raise": "Nhón Gót Một Chân Ngồi Trên Máy Smith",
    "Pull Up (Neutral Grip)": "Kéo Xà Tay Trong",
    "Resistance Band Seated Hip Abduction": "Dạng Hông Ngồi Với Dây Kháng Lực",
    "Bear Crawl": "Bò Như Gấu",
    "Sled 45° Leg Press": "Đạp Chân 45 Độ",
    "Isometric Wipers": "Ép Ngực Đẳng Trương",
    "Raise Single Arm Push-Up": "Chống Đẩy Một Tay Nâng Cao",
    "Weighted Stretch Lunge": "Chùng Chân Có Tạ",
    "Seated Calf Stretch (Male)": "Căng Bắp Chân Ngồi",
    "Lever Lying Leg Curl": "Gập Đùi Nằm Trên Máy",
    "Hip Raise (Bent Knee)": "Nâng Hông Gập Gối",
    "Smith Bent Knee Good Morning": "Good Morning Gập Gối Trên Máy Smith",
    "Ez Bar Standing French Press": "French Press Đứng Với Thanh EZ",
    "Smith Upright Row": "Kéo Đứng Trên Máy Smith",
    "Jack Jump (Male)": "Nhảy Jack",
    "Barbell Jump Squat": "Squat Bật Nhảy Với Tạ Đòn",
    "Runners Stretch": "Căng Cơ Người Chạy",
    "Barbell Bench Press": "Đẩy Ngực Với Tạ Đòn",
    "Barbell Incline Bench Press": "Đẩy Ngực Nghiêng Với Tạ Đòn",
    "Barbell Decline Bench Press": "Đẩy Ngực Dốc Với Tạ Đòn",
    "Barbell Squat": "Squat Với Tạ Đòn",
    "Barbell Deadlift": "Deadlift Với Tạ Đòn",
    "Barbell Row": "Kéo Cơ Với Tạ Đòn",
    "Dumbbell Bench Press": "Đẩy Ngực Với Tạ Đơn",
    "Dumbbell Fly": "Ép Ngực Với Tạ Đơn",
    "Dumbbell Shoulder Press": "Đẩy Vai Với Tạ Đơn",
    "Dumbbell Lateral Raise": "Nâng Vai Ngang Với Tạ Đơn",
    "Dumbbell Front Raise": "Nâng Vai Trước Với Tạ Đơn",
    "Dumbbell Curl": "Cuộn Tạ Đơn",
    "Dumbbell Hammer Curl": "Cuộn Búa Với Tạ Đơn",
    "Dumbbell Triceps Extension": "Duỗi Tay Sau Với Tạ Đơn",
    "Dumbbell Row": "Kéo Cơ Với Tạ Đơn",
    "Dumbbell Lunges": "Chùng Chân Với Tạ Đơn",
    "Dumbbell Step-Up": "Bước Lên Với Tạ Đơn",
    "Dumbbell Deadlift": "Deadlift Với Tạ Đơn",
    "Dumbbell Shrug": "Nhún Vai Với Tạ Đơn",
    "Cable Fly": "Ép Ngực Với Cáp",
    "Cable Row": "Kéo Cơ Với Cáp",
    "Cable Pulldown": "Kéo Xô Với Cáp",
    "Cable Curl": "Cuộn Tay Với Cáp",
    "Cable Triceps Extension": "Duỗi Tay Sau Với Cáp",
    "Cable Kickback": "Đá Sau Với Cáp",
    "Cable Crunch": "Gập Bụng Với Cáp",
    "Cable Twist": "Xoay Với Cáp",
    "Kettlebell Swing": "Kettlebell Swing",
    "Kettlebell Snatch": "Kettlebell Snatch",
    "Kettlebell Clean": "Kettlebell Clean",
    "Kettlebell Goblet Squat": "Squat Goblet Với Tạ Ấm",
    "Push-Up": "Chống Đẩy",
    "Pull-Up": "Kéo Xà",
    "Chin-Up": "Kéo Xà Ngửa Tay",
    "Squat": "Squat",
    "Deadlift": "Deadlift",
    "Bench Press": "Đẩy Ngực",
    "Overhead Press": "Đẩy Vai",
    "Bent Over Row": "Kéo Cúi Người",
    "Lunges": "Chùng Chân",
    "Sit-Up": "Gập Bụng",
    "Crunch": "Gập Bụng",
    "Leg Raise": "Nâng Chân",
    "Plank": "Plank",
    "Burpee": "Burpee",
    "Mountain Climber": "Leo Núi",
    "Triceps Dip": "Dips Tay Sau",
    "Chest Dip": "Dips Ngực",
    "Push-Up (Wall)": "Chống Đẩy (Tường)",
    "Diamond Push-Up": "Chống Đẩy Kim Cương",
    "Archer Push Up": "Chống Đẩy Cung Thủ",
    "Clap Push Up": "Chống Đẩy Vỗ Tay",
    "Wide Grip Pull-Up": "Kéo Xà Tay Rộng",
    "Close Grip Chin-Up": "Kéo Xà Ngửa Tay Hẹp",
    "Reverse Grip Pull-Up": "Kéo Xà Tay Ngược",
    "Romanian Deadlift": "Deadlift Romania",
    "Stiff Leg Deadlift": "Deadlift Chân Thẳng",
    "Sumo Deadlift": "Deadlift Sumo",
    "Front Squat": "Squat Trước",
    "Goblet Squat": "Squat Goblet",
    "Split Squat": "Squat Tách Chân",
    "Pistol Squat": "Squat Một Chân",
    "Hack Squat": "Hack Squat",
    "Sissy Squat": "Sissy Squat",
    "Zercher Squat": "Squat Zercher",
    "Cossack Squat": "Squat Cossack",
    "Box Jump": "Nhảy Hộp",
    "Jump Squat": "Squat Bật Nhảy",
    "Long Jump": "Nhảy Xa",
    "Wall Ball": "Ném Bóng Vào Tường",
    "Handstand": "Trồng Cây Chuối",
    "Handstand Push-Up": "Chống Đẩy Trồng Cây Chuối",
    "Pistol Squat": "Pistol Squat",
    "Kettlebell Swing": "Vung tạ ấm",
    "Air Bike": "Đạp xe không khí",
    "Spine Twist": "Xoay cột sống",
    "Wrist Circles": "Xoay cổ tay",
    "Ankle Circles": "Xoay mắt cá chân",
    "Neck Side Stretch": "Căng cơ cổ nghiêng",
    "Bodyweight Squatting Row": "Kéo cơ ngồi xổm tự trọng",
    "Quad": "Cơ tứ đầu đùi",
    "Quads": "Cơ tứ đầu đùi",
    "Potty Squat": "Squat ngồi xổm",
    "Rocking Frog Stretch": "Căng cơ ếch đung đưa",
    "Prone Twist On Stability Ball": "Xoay nằm sấp trên bóng",
    "Standing Lateral Stretch": "Căng cơ bên đứng",
    "Calf Stretch With Rope": "Căng bắp chân với dây",
    "Dynamic Chest Stretch (Male)": "Căng cơ ngực động (Nam)",
    "Gentle Prone Twist On Stability Ball": "Xoay nằm sấp nhẹ nhàng trên bóng",
    "Squat To Overhead Reach With Twist": "Squat vươn trên đầu kèm xoay",
    "Ski Step": "Bước trượt tuyết",
    "Bent Knee Lying Twist (Male)": "Xoay nằm gập gối (Nam)",
    "Semi Squat Jump (Male)": "Nhảy squat nửa (Nam)",
    "Advanced Dumbbell Stiff Leg Deadlift": "Deadlift chân thẳng nâng cao với tạ đơn",
    "Prone Twist On Stability Ball": "Xoay nằm sấp trên bóng",
    "Side-To-Side Chin": "Kéo xà ngang",
    "Side-To-Side Toe Touch (Male)": "Chạm ngón chân ngang (Nam)",
    "Side Lying Floor Stretch": "Căng cơ nằm nghiêng trên sàn",
    "Side Lying Hip Adduction (Male)": "Khép hông nằm nghiêng (Nam)",
    "Seated Glute Stretch": "Căng cơ mông ngồi",
    "Seated Piriformis Stretch": "Căng cơ hình lê ngồi",
    "Seated Lower Back Stretch": "Căng lưng dưới ngồi",
    "Seated Wide Angle Pose Sequence": "Chuỗi tư thế góc rộng ngồi",
    "Chair Leg Extended Stretch": "Căng cơ duỗi chân trên ghế",
    "Standing Hamstring And Calf Stretch With Strap": "Căng đùi sau và bắp chân với dây",
    "Standing Calves Calf Stretch": "Căng bắp chân đứng",
    "Standing Calf Raise (On A Staircase)": "Nhón gót trên cầu thang",
    "Standing Behind Neck Press": "Đẩy sau cổ đứng",
    "Standing Single Leg Curl": "Gập đùi một chân đứng",
    "Standing Wheel Rollerout": "Lăn bánh xe đứng",
    "Standing Pelvic Tilt": "Nghiêng xương chậu đứng",
    "Standing Archer": "Cung thủ đứng",
    "Leg Up Hamstring Stretch": "Căng đùi sau duỗi chân",
    "Leg Pull In Flat Bench": "Kéo chân vào ghế phẳng",
    "Side Bridge Hip Abduction": "Dạng hông cầu nghiêng",
    "Side Bridge V. 2": "Cầu nghiêng phiên bản 2",
    "Side Hip (On Parallel Bars)": "Hông nghiêng trên xà song song",
    "Side Hip Abduction": "Dạng hông nghiêng",
    "Side Plank Hip Adduction": "Khép hông plank nghiêng",
    "Side Wrist Pull Stretch": "Kéo cổ tay nghiêng",
    "Side Push-Up": "Chống đẩy nghiêng",
    "Side Cable High Row (Kneeling)": "Kéo cáp cao nghiêng quỳ",
    "Shoulder Tap Push-Up": "Chống đẩy chạm vai",
    "Shoulder Tap": "Chạm vai",
    "Shoulder Grip Pull-Up": "Kéo xà nắm vai",
    "Sissy Squat Isolation": "Sissy Squat cô lập",
    "Single Leg Calf Raise (On A Dumbbell)": "Nhón gót một chân trên tạ đơn",
    "Single Leg Platform Slide": "Trượt một chân",
    "Single Leg Squat (Pistol) Male": "Squat một chân (Pistol) Nam",
    "Single Leg Bridge With Outstretched Leg": "Cầu một chân duỗi chân",
    "Single Arm Push-Up": "Chống đẩy một tay",
    "Skin The Cat": "Lộn vòng",
    "Skater Hops": "Nhảy vận động viên",
    "Ski Ergometer": "Máy tập trượt tuyết",
    "Snatch Pull": "Kéo Snatch",
    "Sphinx": "Sphinx",
    "Spell Caster": "Spell Caster",
    "Spider Crawl Push Up": "Chống đẩy bò nhện",
    "Squat Jerk": "Squat Jerk",
    "Squat On Bosu Ball": "Squat trên bóng Bosu",
    "Squat To Overhead Reach": "Squat vươn trên đầu",
    "Star Jump (Male)": "Nhảy sao (Nam)",
    "Stationary Bike Run": "Đạp xe tại chỗ",
    "Straddle Maltese": "Maltese dạng chân",
    "Straddle Planche": "Planche dạng chân",
    "Straight Leg Outer Hip Abductor": "Dạng hông ngoài chân thẳng",
    "Superman Push-Up": "Chống đẩy siêu nhân",
    "Suspended Abdominal Fallout": "Treo người gập bụng",
    "Suspended Push-Up": "Chống đẩy treo",
    "Suspended Reverse Crunch": "Gập bụng ngược treo",
    "Suspended Row": "Kéo cơ treo",
    "Suspended Split Squat": "Squat tách chân treo",
    "Swimmer Kicks V. 2 (Male)": "Đá chân bơi phiên bản 2 (Nam)",
    "Swing 360": "Swing 360",
    "Three Bench Dip": "Dips ba ghế",
    "Tire Flip": "Lật lốp xe",
    "Trap Bar Deadlift": "Deadlift thanh trap",
    "Tuck Crunch": "Gập bụng cuộn",
    "Twin Handle Parallel Grip Lat Pulldown": "Kéo xô song song hai tay cầm",
    "Twist Hip Lift": "Nâng hông xoay",
    "Twisted Leg Raise": "Nâng chân xoay",
    "Upper Back Stretch": "Căng lưng trên",
    "V-Sit On Floor": "V-Sit trên sàn",
    "Vertical Leg Raise (On Parallel Bars)": "Nâng chân thẳng đứng trên xà song song",
    "Walk Elliptical Cross Trainer": "Đi bộ máy Elliptical",
    "Walking High Knees Lunge": "Chùng chân đi bộ nâng gối cao",
    "Walking Lunge": "Chùng chân đi bộ",
    "Walking On Incline Treadmill": "Đi bộ trên máy chạy nghiêng",
    "Weighted Bench Dip": "Dips ghế có tạ",
    "Weighted Close Grip Chin-Up On Dip Cage": "Kéo xà hẹp có tạ",
    "Weighted Cossack Squats (Male)": "Squat Cossack có tạ (Nam)",
    "Weighted Crunch": "Gập bụng có tạ",
    "Weighted Decline Sit-Up": "Gập bụng dốc có tạ",
    "Weighted Donkey Calf Raise": "Nhón gót lừa có tạ",
    "Weighted Drop Push Up": "Chống đẩy rơi có tạ",
    "Weighted Front Plank": "Plank trước có tạ",
    "Weighted Front Raise": "Nâng vai trước có tạ",
    "Weighted Hanging Leg-Hip Raise": "Nâng chân hông treo có tạ",
    "Weighted Hyperextension (On Stability Ball)": "Duỗi lưng có tạ trên bóng",
    "Weighted Muscle Up": "Muscle Up có tạ",
    "Weighted One Hand Pull Up": "Kéo xà một tay có tạ",
    "Weighted Overhead Crunch (On Stability Ball)": "Gập bụng trên đầu có tạ trên bóng",
    "Weighted Pull-Up": "Kéo xà có tạ",
    "Weighted Russian Twist": "Xoay Nga có tạ",
    "Weighted Seated Twist (On Stability Ball)": "Xoay ngồi có tạ trên bóng",
    "Weighted Side Bend (On Stability Ball)": "Gập bên có tạ trên bóng",
    "Weighted Squat": "Squat có tạ",
    "Weighted Standing Curl": "Cuộn tạ đứng có tạ",
    "Weighted Straight Bar Dip": "Dips thanh thẳng có tạ",
    "Weighted Svend Press": "Đẩy Svend có tạ",
    "Weighted Three Bench Dips": "Dips ba ghế có tạ",
    "Wheel Rollerout": "Lăn bánh xe",
    "Wheel Run": "Chạy bánh xe",
    "Wide Grip Pull-Up": "Kéo xà tay rộng",
    "Wide Grip Rear Pull-Up": "Kéo xà sau tay rộng",
    "Wide-Grip Chest Dip On High Parallel Bars": "Dips ngực rộng trên xà song song cao",
    "World Greatest Stretch": "Bài căng cơ tốt nhất thế giới",
    "Wrist Rollerer": "Lăn cổ tay",
    "Front Lever": "Đòn trước",
    "Front Lever Reps": "Đòn trước lần",
    "Back Lever": "Đòn sau",
    "Full Planche": "Planche hoàn toàn",
    "Full Planche Push-Up": "Chống đẩy Planche hoàn toàn",
    "Straddle Planche": "Planche dạng chân",
    "Lean Planche": "Planche nghiêng",
    "Stalder Press": "Đẩy Stalder",
    "Flag": "Cờ",
    "L-Pull-Up": "Kéo xà chữ L",
    "L-Sit On Floor": "Ngồi chữ L trên sàn",
    "Muscle Up": "Muscle Up",
    "Muscle-Up (On Vertical Bar)": "Muscle Up trên xà đứng",
    "Kipping Muscle Up": "Muscle Up Kipping",
    "Ring Dips": "Dips vòng",
    "Rope Climb": "Leo dây",
    "Burpee": "Burpee",
    "Dead Bug": "Bọ chết",
    "Battling Ropes": "Vung dây thừng",
    "Balance Board": "Bảng thăng bằng",
    "Body-Up": "Nâng người",
    "Mountain Climber": "Leo núi",
    "Crab Twist Toe Touch": "Cua xoay chạm ngón chân",
    "Cocoons": "Kén",
    "Cocoons With Mega": "Kén mở rộng",
    "Butt-Ups": "Nâng mông",
    "Astride Jumps (Male)": "Nhảy dạng chân (Nam)",
    "Alternate Heel Touchers": "Chạm gót luân phiên",
    "Basic Toe Touch (Male)": "Chạm ngón chân cơ bản (Nam)",
    "Backward Jump": "Nhảy lùi",
    "Back And Forth Step": "Bước tới lui",
    "Assisted Prone Hamstring": "Căng đùi sau nằm sấp có hỗ trợ",
    "Assisted Motion Russian Twist": "Xoay Nga có hỗ trợ",
    "Arms Apart Circular Toe Touch (Male)": "Chạm ngón chân vòng tròn dang tay (Nam)",
    "Arm Slingers Hanging Bent Knee Legs": "Treo vung tay gập gối",
    "Arm Slingers Hanging Straight Legs": "Treo vung tay thẳng chân",
    "Alternating Bear Crawl": "Bò gấu luân phiên",
    "45° Side Bend": "Gập bên 45 độ",
    "Cycle Cross Trainer": "Máy tập chéo",
    "Curtsey Squat": "Squat kiểu curtsy",
    "Controlled Wrist Rollerer": "Lăn cổ tay kiểm soát",
    "Bodyweight Drop Jump Squat": "Squat nhảy rơi tự trọng",
    "Bottoms-Up": "Nâng mông",
    "Chest Tap Push-Up (Male)": "Chống đẩy chạm ngực (Nam)",
    "Deep Push Up": "Chống đẩy sâu",
    "Cross Body Crunch": "Gập bụng chéo",
    "Drop Push Up": "Chống đẩy rơi",
    "Elbow Dips": "Dips khuỷu tay",
    "Elbow Lift - Reverse Push-Up": "Nâng khuỷu tay - Chống đẩy ngược",
    "Elbow-To-Knee": "Khuỷu tay chạm gối",
    "Elevator": "Thang máy",
    "Finger Curls": "Cuộn ngón tay",
    "Flutter Kicks": "Đá chân cắt kéo",
    "Forward Jump": "Nhảy trước",
    "Frankenstein Squat": "Squat Frankenstein",
    "Frog Crunch": "Gập bụng ếch",
    "Frog Planche": "Planche ếch",
    "Glute Bridge March": "Cầu mông bước",
    "Glute-Ham Raise": "Nâng đùi sau mông",
    "Gorilla Chin": "Kéo xà ngửa khỉ đột",
    "Groin Crunch": "Gập bụng háng",
    "Hands Bike": "Đạp xe tay",
    "Hands Clasped Circular Toe Touch (Male)": "Chạm ngón chân vòng tròn chắp tay (Nam)",
    "Hug Keens To Chest": "Ôm gối vào ngực",
    "Inchworm": "Sâu đo",
    "Inchworm V. 2": "Sâu đo phiên bản 2",
    "Jack Burpee": "Jack Burpee",
    "Jump Rope": "Nhảy dây",
    "Janda Sit-Up": "Gập bụng Janda",
    "Kick Out Sit": "Ngồi đá chân",
    "Kneeling Jump Squat": "Squat bật nhảy quỳ",
    "Kneeling Lat Stretch": "Căng cơ xô quỳ",
    "Korean Dips": "Dips Hàn Quốc",
    "Landmine 180": "Landmine 180",
    "Landmine Lateral Raise": "Landmine ngang",
    "London Bridge": "Cầu London",
    "Lying Elbow To Knee": "Khuỷu tay chạm gối nằm",
    "Medicine Ball Chest Pass": "Chuyền bóng ngực",
    "Monster Walk": "Đi quái vật",
    "Neck Side Stretch": "Căng cơ cổ nghiêng",
    "Negative Crunch": "Gập bụng âm",
    "Otis Up": "Otis Up",
    "Outside Leg Kick Push-Up": "Chống đẩy đá chân ngoài",
    "Overhead Triceps Stretch": "Căng cơ tam đầu trên đầu",
    "Pelvic Tilt": "Nghiêng xương chậu",
    "Pelvic Tilt Into Bridge": "Nghiêng xương chậu vào cầu",
    "Peroneals Stretch": "Căng cơ mác",
    "Pike-To-Cobra Push-Up": "Chống đẩy gập-hổ mang",
    "Prisoner Half Sit-Up (Male)": "Gập bụng nửa kiểu tù nhân (Nam)",
    "Posterior Tibialis Stretch": "Căng cơ chày sau",
    "Posterior Step To Overhead Reach": "Bước sau vươn cao",
    "Pull-In (On Stability Ball)": "Kéo gối vào trên bóng",
    "Quads": "Cơ tứ đầu đùi",
    "Quads Complex": "Chuỗi cơ tứ đầu đùi",
    "Rear Deltoid Stretch": "Căng cơ vai sau",
    "Reverse Dip": "Dips ngược",
    "Reverse Hyper On Flat Bench": "Duỗi lưng ngược trên ghế phẳng",
    "Roller Body Saw": "Cưa thân với con lăn",
    "Roller Reverse Crunch": "Gập bụng ngược với con lăn",
    "Rope Climb": "Leo dây",
    "Run": "Chạy",
    "Run (Equipment)": "Chạy (máy)",
    "Scapula Dips": "Dips bả vai",
    "Scapula Push-Up": "Chống đẩy bả vai",
    "Scapular Pull-Up": "Kéo xà bả vai",
    "Scissor Jumps (Male)": "Nhảy kéo (Nam)",
    "Short Stride Run": "Chạy bước ngắn",
    "Sissy Squat": "Sissy Squat",
    "Sledge Hammer": "Búa tạ",
    "Snatch Pull": "Snatch kéo",
    "Split Squats": "Squat tách chân",
    "Squat Jerk": "Squat Jerk",
    "Sphinx": "Nhân sư",
    "Spell Caster": "Phù thủy",
    "Spencer Push-Up": "Chống đẩy Spencer",
    "Spider Crawl Push Up": "Chống đẩy bò nhện",
    "Spine Stretch": "Căng cột sống",
    "Squat On Bosu Ball": "Squat trên bóng Bosu",
    "Stalder Press": "Đẩy Stalder",
    "Star Jump (Male)": "Nhảy sao (Nam)",
    "Stationary Bike Walk": "Đạp xe tại chỗ",
    "Straddle Maltese": "Maltese dạng chân",
    "Stretched Full Planche Push-Up": "Chống đẩy Planche duỗi hoàn toàn",
    "Suspended Abdominal Fallout": "Treo người gập bụng",
    "Suspended Push-Up": "Chống đẩy treo",
    "Suspended Reverse Crunch": "Gập bụng ngược treo",
    "Suspended Row": "Kéo cơ treo",
    "Suspended Split Squat": "Squat tách chân treo",
    "Swimmer Kicks V. 2 (Male)": "Đá chân bơi phiên bản 2 (Nam)",
    "Swing 360": "Swing 360",
    "Three Bench Dip": "Dips ba ghế",
    "Tire Flip": "Lật lốp xe",
    "Trap Bar Deadlift": "Deadlift thanh trap",
    "Triceps Press": "Duỗi tay sau",
    "Tuck Crunch": "Gập bụng cuộn",
    "Twin Handle Parallel Grip Lat Pulldown": "Kéo xô song song hai tay cầm",
    "Twist Hip Lift": "Nâng hông xoay",
    "Twisted Leg Raise": "Nâng chân xoay",
    "Upper Back Stretch": "Căng lưng trên",
    "V-Sit On Floor": "V-Sit trên sàn",
    "Vertical Leg Raise (On Parallel Bars)": "Nâng chân thẳng đứng trên xà song song",
    "Walk Elliptical Cross Trainer": "Đi bộ máy Elliptical",
    "Walking High Knees Lunge": "Chùng chân đi bộ nâng gối cao",
    "Walking Lunge": "Chùng chân đi bộ",
    "Walking On Incline Treadmill": "Đi bộ trên máy chạy nghiêng",
    "Weighted Bench Dip": "Dips ghế có tạ",
    "Weighted Close Grip Chin-Up On Dip Cage": "Kéo xà hẹp có tạ",
    "Weighted Cossack Squats (Male)": "Squat Cossack có tạ (Nam)",
    "Weighted Crunch": "Gập bụng có tạ",
    "Weighted Decline Sit-Up": "Gập bụng dốc có tạ",
    "Weighted Donkey Calf Raise": "Nhón gót lừa có tạ",
    "Weighted Drop Push Up": "Chống đẩy rơi có tạ",
    "Weighted Front Plank": "Plank trước có tạ",
    "Weighted Front Raise": "Nâng vai trước có tạ",
    "Weighted Hanging Leg-Hip Raise": "Nâng chân hông treo có tạ",
    "Weighted Hyperextension (On Stability Ball)": "Duỗi lưng có tạ trên bóng",
    "Weighted Kneeling Step With Swing": "Bước quỳ vung có tạ",
    "Weighted Lunge With Swing": "Chùng chân vung có tạ",
    "Weighted Muscle Up": "Muscle Up có tạ",
    "Weighted One Hand Pull Up": "Kéo xà một tay có tạ",
    "Weighted Overhead Crunch (On Stability Ball)": "Gập bụng trên đầu có tạ trên bóng",
    "Weighted Pull-Up": "Kéo xà có tạ",
    "Weighted Round Arm": "Vung tay có tạ",
    "Weighted Russian Twist": "Xoay Nga có tạ",
    "Weighted Seated Twist (On Stability Ball)": "Xoay ngồi có tạ trên bóng",
    "Weighted Side Bend (On Stability Ball)": "Gập bên có tạ trên bóng",
    "Weighted Squat": "Squat có tạ",
    "Weighted Standing Curl": "Cuộn tạ đứng có tạ",
    "Weighted Standing Hand Squeeze": "Bóp tay đứng có tạ",
    "Weighted Straight Bar Dip": "Dips thanh thẳng có tạ",
    "Weighted Svend Press": "Đẩy Svend có tạ",
    "Weighted Three Bench Dips": "Dips ba ghế có tạ",
    "Weighted Tricep Dips": "Dips tay sau có tạ",
    "Weighted Triceps Dip On High Parallel Bars": "Dips tay sau có tạ trên xà song song",
    "Wheel Rollerout": "Lăn bánh xe",
    "Wheel Run": "Chạy bánh xe",
    "Wide Grip Pull-Up": "Kéo xà tay rộng",
    "Wide Grip Rear Pull-Up": "Kéo xà sau tay rộng",
    "Wide Hand Push Up": "Chống đẩy tay rộng",
    "Wide-Grip Chest Dip On High Parallel Bars": "Dips ngực rộng trên xà song song cao",
    "Wind Sprints": "Chạy nước rút",
    "World Greatest Stretch": "Bài căng cơ tốt nhất thế giới",
    "Wrist Circles": "Xoay cổ tay",
    "Wrist Rollerer": "Lăn cổ tay",
    "Front Lever": "Đòn trước",
    "Front Lever Reps": "Đòn trước lần",
    "Back Lever": "Đòn sau",
    "Full Planche": "Planche hoàn toàn",
    "Full Planche Push-Up": "Chống đẩy Planche hoàn toàn",
    "Lean Planche": "Planche nghiêng",
    "Flag": "Cờ",
    "L-Pull-Up": "Kéo xà chữ L",
    "L-Sit On Floor": "Ngồi chữ L trên sàn",
    "Muscle Up": "Muscle Up",
    "Muscle-Up (On Vertical Bar)": "Muscle Up trên xà đứng",
    "Kipping Muscle Up": "Muscle Up Kipping",
    "Ring Dips": "Dips vòng",
    "Gorilla Chin": "Kéo xà ngửa khỉ đột",
    "Mountain Climber": "Leo núi",
    "Lying Leg Raise Flat Bench": "Nâng chân nằm trên ghế phẳng",
}

# Longest-first phrase replacements for instructions
PHRASES = OrderedDict([
    (r'\bstep:(\d+)\b', r'bước \1'),
    (r'\bLie face down on\b', 'Nằm sấp trên'),
    (r'\bLie face up on\b', 'Nằm ngửa trên'),
    (r'\bLie flat on your back\b', 'Nằm ngửa trên'),
    (r'\bLie flat on\b', 'Nằm thẳng trên'),
    (r'\bLie on your back\b', 'Nằm ngửa'),
    (r'\bLie on your stomach\b', 'Nằm sấp'),
    (r'\bLie face down\b', 'Nằm sấp'),
    (r'\bLie on your side\b', 'Nằm nghiêng'),
    (r'\bStart on all fours\b', 'Bắt đầu ở tư thế bò'),
    (r'\bon your hands and knees\b', 'chống tay và gối'),
    (r'\bPlace your hands on\b', 'Đặt hai tay lên'),
    (r'\bPlace your feet on\b', 'Đặt hai chân lên'),
    (r'\bPlace your hands\b', 'Đặt hai tay'),
    (r'\bPlace your feet\b', 'Đặt hai chân'),
    (r'\bGrasp the\b', 'Nắm'),
    (r'\bGrasp a\b', 'Nắm'),
    (r'\bHold the\b', 'Giữ'),
    (r'\bHold a\b', 'Giữ'),
    (r'\bkeep your back straight\b', 'giữ lưng thẳng'),
    (r'\bkeep your core engaged\b', 'giữ cơ trung tâm siết chặt'),
    (r'\bkeep your body\b', 'giữ cơ thể'),
    (r'\bKeeping your back straight\b', 'Giữ lưng thẳng'),
    (r'\bKeeping your core engaged\b', 'Giữ cơ trung tâm siết chặt'),
    (r'\bkeeping your back straight\b', 'giữ lưng thẳng'),
    (r'\bkeeping your core tight\b', 'giữ cơ trung tâm siết chặt'),
    (r'\bEngage your core\b', 'Siết chặt cơ trung tâm'),
    (r'\bSqueeze your shoulder blades\b', 'Siết hai bả vai'),
    (r'\bsqueeze your shoulder blades\b', 'siết hai bả vai'),
    (r'\bsuch as\b', 'như'),
    (r'\battach the\b', 'gắn'),
    (r'\bAttach the\b', 'Gắn'),
    (r'\bez barbell\b', 'thanh EZ'),
    (r'\bez bar\b', 'thanh EZ'),
    (r'\bv-bar\b', 'thanh V'),
    (r'\bwider than\b', 'rộng hơn'),
    (r'\bcloser than\b', 'gần hơn'),
    (r'\bhigher than\b', 'cao hơn'),
    (r'\blower than\b', 'thấp hơn'),
    (r'\bnarrower than\b', 'hẹp hơn'),
    (r'\bSlowly lower\b', 'Từ từ hạ'),
    (r'\bslowly lower\b', 'từ từ hạ'),
    (r'\bPause for a moment\b', 'Dừng lại một chốc'),
    (r'\bpause for a moment\b', 'dừng lại một chốc'),
    (r'\bPause for a brief moment\b', 'Dừng lại một chốc'),
    (r'\bpause for a brief moment\b', 'dừng lại một chốc'),
    (r'\bfor the desired number of repetitions\b', 'cho số lần yêu cầu'),
    (r'\bRepeat for the desired number of repetitions\.', 'Lặp lại cho đủ số lần yêu cầu.'),
    (r'\bRepeat for the desired number of repetitions\b', 'Lặp lại cho đủ số lần yêu cầu'),
    (r'\bthen switch legs\b', 'sau đó đổi chân'),
    (r'\bswitch legs and repeat\b', 'đổi chân và lặp lại'),
    (r'\bswitch sides and repeat\b', 'đổi bên và lặp lại'),
    (r'\bspread your feet\b', 'dang rộng hai chân'),
    (r'\bspread your arms\b', 'dang rộng hai tay'),
    (r'\bwith your feet shoulder-width apart\b', 'hai chân rộng bằng vai'),
    (r'\bwith your feet hip-width apart\b', 'hai chân rộng bằng hông'),
    (r'\bshoulder-width apart\b', 'rộng bằng vai'),
    (r'\bhip-width apart\b', 'rộng bằng hông'),
    (r'\bSit on\b', 'Ngồi trên'),
    (r'\bsit on\b', 'ngồi trên'),
    (r'\bStand with\b', 'Đứng với'),
    (r'\bStand up\b', 'Đứng thẳng'),
    (r'\bstand up\b', 'đứng thẳng'),
    (r'\bbend your knees\b', 'gập đầu gối'),
    (r'\bBend your knees\b', 'Gập đầu gối'),
    (r'\bBend your elbows\b', 'Gập khuỷu tay'),
    (r'\bbend your elbows\b', 'gập khuỷu tay'),
    (r'\bextend your arms\b', 'duỗi hai tay'),
    (r'\bExtend your arms\b', 'Duỗi hai tay'),
    (r'\bextend your legs\b', 'duỗi hai chân'),
    (r'\bExtend your legs\b', 'Duỗi hai chân'),
    (r'\blift your hips\b', 'nâng hông lên'),
    (r'\bLift your hips\b', 'Nâng hông lên'),
    (r'\blift your chest\b', 'nâng ngực lên'),
    (r'\bLift your chest\b', 'Nâng ngực lên'),
    (r'\blift your legs\b', 'nâng chân lên'),
    (r'\bLift your legs\b', 'Nâng chân lên'),
    (r'\bRaise your arms\b', 'Nâng hai tay'),
    (r'\braise your arms\b', 'nâng hai tay'),
    (r'\bRaise your heels\b', 'Nhấc gót chân'),
    (r'\braise your heels\b', 'nhấc gót chân'),
    (r'\bPull the bar\b', 'Kéo thanh đòn'),
    (r'\bPush the bar\b', 'Đẩy thanh đòn'),
    (r'\bPush through your heels\b', 'Đẩy qua gót chân'),
    (r'\bpush through your heels\b', 'đẩy qua gót chân'),
    (r'\bHold this position\b', 'Giữ tư thế này'),
    (r'\bReturn to the starting position\b', 'Trở về tư thế ban đầu'),
    (r'\breturn to the starting position\b', 'trở về tư thế ban đầu'),
    (r'\bstarting position\b', 'tư thế ban đầu'),
    (r'\bthe starting position\b', 'tư thế ban đầu'),
    (r'\bStep:(\d+)\s+(.+)', r'Bước \1: \2'),
])

# Comprehensive EN→VI word dictionary (all ~950 instruction words)
WORD_DICT = {
    "a": "", "an": "", "the": "",
    "is": "là", "are": "là", "be": "là", "was": "", "were": "",
    "it": "nó", "this": "này", "that": "đó", "these": "những", "those": "những",
    "i": "tôi", "you": "bạn", "your": "", "yourself": "",
    "my": "của tôi", "me": "tôi", "we": "chúng ta", "our": "của chúng ta",
    "their": "của họ", "its": "của nó",
    "and": "và", "or": "hoặc", "but": "nhưng", "so": "vì vậy", "because": "bởi vì",
    "if": "nếu", "when": "khi", "while": "trong khi", "until": "cho đến khi",
    "as": "khi", "than": "hơn", "then": "sau đó", "both": "cả hai",
    "nor": "cũng không", "not": "không", "yet": "nhưng", "for": "trong",
    "with": "với", "without": "không có",
    "on": "trên", "in": "trong", "at": "ở", "to": "về", "from": "từ",
    "by": "bằng", "into": "vào", "onto": "lên", "upon": "trên",
    "through": "xuyên qua", "across": "ngang qua", "around": "quanh",
    "between": "giữa", "against": "vào", "during": "trong khi",
    "after": "sau", "before": "trước", "above": "trên", "below": "dưới",
    "under": "dưới", "over": "trên", "up": "lên", "down": "xuống",
    "out": "ra ngoài", "off": "khỏi", "away": "ra xa", "back": "lại",
    "forth": "tới", "about": "về", "of": "của", "like": "như",
    "including": "bao gồm", "except": "ngoại trừ",
    "no": "không", "yes": "có", "any": "bất kỳ", "some": "một số",
    "all": "tất cả", "every": "mỗi", "each": "mỗi", "both": "cả hai",
    "few": "vài", "many": "nhiều", "much": "nhiều", "most": "hầu hết",
    "such": "như vậy", "only": "chỉ", "also": "cũng", "very": "rất",
    "too": "quá", "just": "chỉ", "still": "vẫn", "already": "đã",
    "always": "luôn", "never": "không bao giờ", "often": "thường",
    "usually": "thường", "sometimes": "thỉnh thoảng",
    "here": "ở đây", "there": "ở đó", "where": "nơi",
    "now": "bây giờ", "again": "lại", "ever": "bao giờ",

    # Numbers
    "one": "một", "two": "hai", "three": "ba", "four": "bốn",
    "five": "năm", "six": "sáu", "seven": "bảy", "eight": "tám",
    "nine": "chín", "ten": "mười",
    "first": "đầu tiên", "second": "thứ hai", "third": "thứ ba",

    # Exercise-specific verbs
    "stand": "đứng", "stands": "đứng", "standing": "đang đứng",
    "sit": "ngồi", "sits": "ngồi", "sitting": "đang ngồi",
    "lie": "nằm", "lies": "nằm", "lying": "nằm",
    "place": "đặt", "places": "đặt", "placing": "đang đặt",
    "hold": "giữ", "holds": "giữ", "holding": "đang giữ",
    "grasp": "nắm", "grasps": "nắm", "grasping": "đang nắm",
    "bend": "gập", "bends": "gập", "bending": "gập",
    "bent": "gập",
    "extend": "duỗi", "extends": "duỗi", "extending": "duỗi",
    "extended": "duỗi",
    "lower": "hạ", "lowers": "hạ", "lowering": "hạ",
    "raise": "nâng", "raises": "nâng", "raising": "nâng",
    "lift": "nâng", "lifts": "nâng", "lifting": "nâng",
    "push": "đẩy", "pushes": "đẩy", "pushing": "đẩy",
    "pull": "kéo", "pulls": "kéo", "pulling": "kéo",
    "press": "ấn", "presses": "ấn", "pressing": "ấn",
    "squeeze": "siết", "squeezes": "siết", "squeezing": "siết",
    "pause": "dừng", "pauses": "dừng", "pausing": "dừng",
    "repeat": "lặp lại", "repeats": "lặp lại", "repeating": "lặp lại",
    "engage": "siết chặt", "engages": "siết chặt", "engaging": "siết chặt",
    "engaged": "siết chặt",
    "keep": "giữ", "keeps": "giữ", "keeping": "giữ",
    "start": "bắt đầu", "starts": "bắt đầu", "starting": "bắt đầu",
    "continue": "tiếp tục", "continues": "tiếp tục",
    "perform": "thực hiện", "performs": "thực hiện",
    "rotate": "xoay", "rotates": "xoay", "rotating": "xoay",
    "rotated": "xoay",
    "return": "trở về", "returns": "trở về",
    "bring": "đưa", "brings": "đưa", "bringing": "đưa",
    "release": "thả", "releases": "thả",
    "straighten": "duỗi thẳng", "straightens": "duỗi thẳng", "straightening": "duỗi thẳng",
    "contract": "co", "contracts": "co",
    "relax": "thả lỏng", "relaxes": "thả lỏng",
    "move": "di chuyển", "moves": "di chuyển",
    "step": "bước", "steps": "bước",
    "jump": "nhảy", "jumps": "nhảy", "jumping": "nhảy",
    "land": "tiếp đất", "lands": "tiếp đất",
    "kick": "đá", "kicks": "đá",
    "swing": "vung", "swings": "vung", "swinging": "vung",
    "lean": "ngả", "leans": "ngả",
    "roll": "lăn", "rolls": "lăn", "rolling": "lăn",
    "wrap": "quấn", "wraps": "quấn",
    "cross": "bắt chéo", "crosses": "bắt chéo",
    "spread": "dang rộng", "spreads": "dang rộng",
    "tighten": "siết", "tightens": "siết",
    "drive": "đẩy", "drives": "đẩy",
    "curl": "cuộn", "curls": "cuộn", "curling": "cuộn",
    "open": "mở", "opens": "mở",
    "close": "khép", "closes": "khép",
    "balance": "thăng bằng", "balances": "thăng bằng",
    "switch": "đổi", "switches": "đổi",
    "alternate": "luân phiên", "alternates": "luân phiên",
    "alternating": "luân phiên",
    "begin": "bắt đầu", "begins": "bắt đầu",
    "finish": "kết thúc", "finishes": "kết thúc",
    "rest": "nghỉ", "rests": "nghỉ", "resting": "nghỉ",
    "inhale": "hít vào", "inhales": "hít vào",
    "exhale": "thở ra", "exhales": "thở ra",
    "breathe": "thở", "breathes": "thở",
    "maintain": "duy trì", "maintains": "duy trì",
    "control": "kiểm soát", "controls": "kiểm soát",
    "ensure": "đảm bảo", "ensures": "đảm bảo",
    "allow": "để", "allows": "để",
    "feel": "cảm nhận", "feels": "cảm nhận",
    "focus": "tập trung", "focuses": "tập trung",
    "brace": "siết", "braces": "siết",
    "tuck": "gập", "tucks": "gập",
    "point": "chỉ", "points": "chỉ", "pointing": "chỉ",
    "position": "đặt", "positions": "đặt", "positioning": "đặt",
    "support": "đỡ", "supports": "đỡ", "supporting": "đỡ",
    "rest": "đặt", "rests": "đặt",
    "lock": "khóa", "locks": "khóa",
    "plant": "đặt", "plants": "đặt",
    "rise": "nâng lên", "rises": "nâng lên",
    "drop": "hạ", "drops": "hạ",
    "hang": "treo", "hangs": "treo", "hanging": "treo",
    "walk": "đi", "walks": "đi", "walking": "đi",
    "run": "chạy", "runs": "chạy",
    "crawl": "bò", "crawls": "bò", "crawling": "bò",
    "climb": "trèo", "climbs": "trèo",

    # Body parts (without "your" prefix - will be combined with "your"→"" removal)
    "body": "cơ thể", "torso": "thân trên",
    "head": "đầu", "neck": "cổ", "face": "mặt",
    "shoulder": "vai", "shoulders": "vai",
    "chest": "ngực", "back": "lưng",
    "arm": "cánh tay", "arms": "hai cánh tay",
    "elbow": "khuỷu tay", "elbows": "khuỷu tay",
    "hand": "bàn tay", "hands": "hai bàn tay",
    "wrist": "cổ tay", "wrists": "cổ tay",
    "finger": "ngón tay", "fingers": "ngón tay",
    "palm": "lòng bàn tay", "palms": "lòng bàn tay",
    "thumb": "ngón cái", "thumbs": "ngón cái",
    "leg": "chân", "legs": "hai chân",
    "knee": "đầu gối", "knees": "đầu gối",
    "thigh": "đùi", "thighs": "đùi",
    "hip": "hông", "hips": "hông",
    "foot": "bàn chân", "feet": "hai bàn chân",
    "ankle": "mắt cá chân", "ankles": "mắt cá chân",
    "heel": "gót chân", "heels": "gót chân",
    "toe": "ngón chân", "toes": "ngón chân",
    "calf": "bắp chân", "calves": "bắp chân",
    "shin": "cẳng chân", "shins": "cẳng chân",
    "rib": "xương sườn", "ribs": "xương sườn",
    "spine": "cột sống",
    "stomach": "bụng",
    "core": "cơ trung tâm",
    "abs": "cơ bụng",
    "glute": "cơ mông", "glutes": "cơ mông",
    "hamstring": "cơ đùi sau", "hamstrings": "cơ đùi sau",
    "quad": "cơ tứ đầu đùi", "quads": "cơ tứ đầu đùi",
    "bicep": "cơ nhị đầu", "biceps": "cơ nhị đầu",
    "tricep": "cơ tam đầu", "triceps": "cơ tam đầu",
    "trapezius": "cơ thang",
    "lat": "cơ xô", "lats": "cơ xô",
    "abductor": "cơ dạng", "abductors": "cơ dạng",
    "adductor": "cơ khép", "adductors": "cơ khép",
    "flexor": "cơ gập", "flexors": "cơ gập",
    "extensor": "cơ duỗi", "extensors": "cơ duỗi",
    "deltoid": "cơ vai", "deltoids": "cơ vai",
    "pectoral": "cơ ngực", "pectorals": "cơ ngực",
    "scapulae": "bả vai",
    "rotator": "cơ xoay",
    "cuff": "cổ tay",
    "blades": "bả vai",

    # Positions / directions
    "upright": "thẳng đứng",
    "straight": "thẳng",
    "parallel": "song song",
    "perpendicular": "vuông góc",
    "forward": "về phía trước",
    "backward": "về phía sau",
    "upward": "lên trên",
    "downward": "xuống dưới",
    "outward": "ra ngoài",
    "inward": "vào trong",
    "sideways": "sang bên",
    "together": "vào nhau",
    "apart": "cách xa nhau",
    "slightly": "hơi",
    "fully": "hoàn toàn",
    "slowly": "từ từ",
    "quickly": "nhanh chóng",
    "explosively": "bùng nổ",
    "firmly": "chắc chắn",
    "gently": "nhẹ nhàng",
    "carefully": "cẩn thận",
    "deeply": "sâu",
    "high": "cao",
    "low": "thấp",
    "comfortably": "thoải mái",
    "safely": "an toàn",
    "properly": "đúng cách",
    "evenly": "đều",
    "directly": "trực tiếp",
    "completely": "hoàn toàn",
    "immediately": "ngay lập tức",
    "gradually": "dần dần",
    "briefly": "ngắn",
    "tight": "chặt",
    "taut": "căng",
    "opening": "mở",
    "tucked": "gập",
    "stationary": "cố định",
    "behind": "phía sau",
    "facing": "hướng về",
    "such": "như",
    "elevated": "nâng cao",
    "wider": "rộng hơn",
    "highest": "cao nhất",
    "lowest": "thấp nhất",
    "attachment": "phụ kiện",
    "pointed": "chỉ",
    "fit": "vừa",
    "select": "chọn",
    "adjust": "điều chỉnh",
    "adjusted": "đã điều chỉnh",
    "waist": "eo",
    "anchor": "điểm neo",
    "sturdy": "chắc chắn",
    "beam": "dầm",
    "attach": "gắn", "attached": "đã gắn", "attaching": "đang gắn",
    "pulley": "ròng rọc", "pulleys": "ròng rọc",
    "pressed": "ấn",
    "pressing": "ấn",
    "incline": "nghiêng",
    "about": "khoảng",
    "setting": "vị trí",
    "like": "như",
    "right": "phải",
    "posterior": "phía sau",
    "anterior": "phía trước",
    "mid": "giữa",
    "resting": "đặt",
    "turned": "xoay",
    "throughout": "trong suốt",
    "both": "cả hai",
    "under": "dưới",
    "inch": "inch",
    "flat": "phẳng",
    "closest": "gần nhất",
    "topmost": "trên cùng",
    "midpoint": "điểm giữa",
    "midway": "giữa chừng",
    "farthest": "xa nhất",
    "nearest": "gần nhất",
    "deepest": "sâu nhất",
    "widest": "rộng nhất",

    # Equipment / objects
    "barbell": "tạ đòn",
    "dumbbell": "tạ đơn", "dumbbells": "tạ đơn",
    "kettlebell": "tạ ấm", "kettlebells": "tạ ấm",
    "cable": "cáp", "cables": "cáp",
    "band": "dây kháng lực", "bands": "dây kháng lực",
    "machine": "máy tập", "machines": "máy tập",
    "bench": "ghế tập", "benches": "ghế tập",
    "bar": "thanh đòn", "bars": "thanh đòn",
    "pull-up": "xà đơn", "pullup": "xà đơn",
    "dip": "dips", "dips": "dips",
    "rope": "dây thừng",
    "handle": "tay cầm", "handles": "tay cầm",
    "pad": "đệm", "pads": "đệm",
    "strap": "dây đai", "straps": "dây đai",
    "belt": "dây đai",
    "towel": "khăn",
    "ball": "bóng",
    "roller": "con lăn",
    "foam": "xốp",
    "mat": "thảm",
    "platform": "bệ",
    "step": "bệ",
    "box": "hộp",
    "chair": "ghế",
    "wall": "tường",
    "floor": "sàn nhà",
    "ground": "mặt đất",
    "surface": "bề mặt",
    "edge": "mép",
    "corner": "góc",
    "center": "trung tâm",
    "side": "bên", "sides": "hai bên",
    "top": "đỉnh",
    "bottom": "đáy",
    "front": "phía trước",
    "rear": "phía sau",
    "middle": "giữa",
    "end": "đầu",
    "tip": "đầu",
    "base": "đế",
    "seat": "ghế ngồi",
    "backrest": "tựa lưng",
    "footplate": "bàn đạp chân",
    "pedal": "bàn đạp",
    "lever": "cần đòn",
    "weight": "tạ", "weights": "tạ",
    "resistance": "kháng lực",

    # Adjectives
    "desired": "mong muốn",
    "same": "cùng",
    "different": "khác",
    "other": "khác",
    "another": "khác",
    "various": "khác nhau",
    "following": "sau",
    "previous": "trước",
    "next": "tiếp theo",
    "last": "cuối cùng",
    "final": "cuối cùng",
    "initial": "ban đầu",
    "starting": "ban đầu",
    "entire": "toàn bộ",
    "complete": "hoàn thành",
    "full": "đầy đủ",
    "half": "một nửa",
    "quarter": "một phần tư",
    "single": "một",
    "double": "gấp đôi",
    "multiple": "nhiều",
    "maximum": "tối đa",
    "minimum": "tối thiểu",
    "optimal": "tối ưu",
    "proper": "đúng",
    "correct": "đúng",
    "good": "tốt",
    "better": "tốt hơn",
    "best": "tốt nhất",
    "bad": "xấu",
    "comfortable": "thoải mái",
    "uncomfortable": "không thoải mái",
    "safe": "an toàn",
    "tight": "chặt",
    "loose": "lỏng",
    "smooth": "mượt",
    "controlled": "kiểm soát",
    "explosive": "bùng nổ",
    "powerful": "mạnh mẽ",
    "gentle": "nhẹ nhàng",
    "firm": "chắc",
    "strong": "mạnh",
    "weak": "yếu",
    "heavy": "nặng",
    "light": "nhẹ",
    "hard": "cứng",
    "soft": "mềm",
    "deep": "sâu",
    "shallow": "nông",
    "wide": "rộng",
    "narrow": "hẹp",
    "close": "gần",
    "far": "xa",
    "long": "dài",
    "short": "ngắn",
    "tall": "cao",
    "low": "thấp",
    "high": "cao",
    "big": "lớn",
    "small": "nhỏ",
    "large": "lớn",
    "little": "nhỏ",
    "major": "chính",
    "minor": "phụ",
    "main": "chính",
    "primary": "chính",
    "secondary": "phụ",
    "additional": "bổ sung",
    "extra": "thêm",
    "normal": "bình thường",
    "usual": "thông thường",
    "regular": "đều đặn",
    "constant": "liên tục",
    "steady": "ổn định",
    "stable": "ổn định",
    "unstable": "không ổn định",
    "dynamic": "động",
    "static": "tĩnh",
    "active": "chủ động",
    "passive": "thụ động",
    "alternate": "luân phiên",
    "alternating": "luân phiên",
    "reverse": "ngược",
    "inverse": "ngược",
    "neutral": "trung tính",
    "positive": "dương",
    "negative": "âm",
    "horizontal": "ngang",
    "vertical": "dọc",
    "diagonal": "chéo",
    "lateral": "bên",
    "medial": "trong",
    "anterior": "trước",
    "posterior": "sau",
    "superior": "trên",
    "inferior": "dưới",
    "inner": "trong",
    "outer": "ngoài",
    "internal": "bên trong",
    "external": "bên ngoài",
    "left": "trái",
    "right": "phải",
    "upper": "trên",
    "lower": "dưới",
    "top": "trên cùng",
    "bottom": "dưới cùng",
    "mid": "giữa",
    "middle": "giữa",
    "central": "trung tâm",
    "front": "trước",
    "rear": "sau",
    "back": "sau",
    "side": "bên",
    "cross": "chéo",
    "straight": "thẳng",
    "curved": "cong",
    "flat": "phẳng",
    "round": "tròn",
    "square": "vuông",

    # Time / count
    "second": "giây", "seconds": "giây",
    "minute": "phút", "minutes": "phút",
    "hour": "giờ", "hours": "giờ",
    "time": "lần", "times": "lần",
    "repetition": "lần", "repetitions": "lần",
    "set": "hiệp", "sets": "hiệp",
    "rep": "lần", "reps": "lần",
    "breath": "nhịp thở", "breaths": "nhịp thở",
    "moment": "chốc lát",
    "period": "khoảng thời gian",
    "interval": "khoảng",
    "duration": "thời gian",
    "count": "đếm",
    "number": "số",
    "amount": "lượng",
    "level": "mức",
    "intensity": "cường độ",
    "speed": "tốc độ",
    "pace": "nhịp độ",
    "range": "phạm vi",
    "motion": "chuyển động",
    "movement": "chuyển động",

    # Gym / exercise specific
    "exercise": "bài tập",
    "workout": "buổi tập",
    "training": "tập luyện",
    "warm-up": "khởi động",
    "cool-down": "thả lỏng",
    "stretch": "căng cơ", "stretching": "căng cơ",
    "flexibility": "sự dẻo dai",
    "strength": "sức mạnh",
    "power": "sức mạnh bùng nổ",
    "endurance": "sức bền",
    "hypertrophy": "phì đại cơ",
    "muscle": "cơ bắp", "muscles": "cơ bắp",
    "joint": "khớp", "joints": "khớp",
    "bone": "xương", "bones": "xương",
    "tendon": "gân", "tendons": "gân",
    "ligament": "dây chằng", "ligaments": "dây chằng",
    "fiber": "sợi cơ", "fibers": "sợi cơ",
    "tissue": "mô",
    "grip": "nắm",
    "overhand": "nắm trên",
    "underhand": "nắm dưới",
    "pronated": "nắm trên",
    "supinated": "nắm dưới",
    "neutral": "trung tính",
    "narrow": "hẹp",
    "wide": "rộng",
    "close": "hẹp",
    "width": "chiều rộng",
    "depth": "độ sâu",
    "height": "độ cao",
    "angle": "góc",
    "degree": "độ", "degrees": "độ",
    "position": "tư thế",
    "posture": "tư thế",
    "form": "kỹ thuật",
    "technique": "kỹ thuật",
    "alignment": "căn chỉnh",
    "balance": "thăng bằng",
    "stability": "ổn định",
    "momentum": "đà",
    "tension": "lực căng",
    "pressure": "áp lực",
    "force": "lực",
    "load": "tải trọng",
    "weight": "trọng lượng",

    # Miscellaneous
    "way": "cách",
    "method": "phương pháp",
    "style": "phong cách",
    "type": "loại",
    "kind": "loại",
    "part": "phần",
    "portion": "phần",
    "section": "phần",
    "area": "khu vực",
    "point": "điểm",
    "spot": "điểm",
    "line": "đường",
    "circle": "vòng tròn",
    "pattern": "mẫu",
    "rhythm": "nhịp điệu",
    "sequence": "chuỗi",
    "order": "thứ tự",
    "step": "bước",
    "stage": "giai đoạn",
    "phase": "giai đoạn",
    "round": "vòng",
    "cycle": "chu kỳ",
    "session": "buổi",
    "routine": "chuỗi bài tập",
    "program": "chương trình",
    "plan": "kế hoạch",
    "goal": "mục tiêu",
    "target": "mục tiêu",
    "result": "kết quả",
    "progress": "tiến bộ",
    "improvement": "cải thiện",
    "change": "thay đổi",
    "adjustment": "điều chỉnh",
    "variation": "biến thể",
    "modification": "biến thể",
    "version": "phiên bản",
    "option": "lựa chọn",
    "alternative": "phương án thay thế",
    "preference": "sở thích",
    "recommendation": "khuyến nghị",
    "tip": "mẹo",
    "note": "ghi chú",
    "warning": "cảnh báo",
    "caution": "thận trọng",
    "instruction": "hướng dẫn",
    "direction": "hướng dẫn",
    "guideline": "hướng dẫn",
    "rule": "quy tắc",
    "principle": "nguyên tắc",
    "key": "chìa khóa",
    "important": "quan trọng",
    "necessary": "cần thiết",
    "essential": "thiết yếu",
    "critical": "quan trọng",
    "crucial": "quan trọng",
    "vital": "quan trọng",
    "beneficial": "có lợi",
    "helpful": "hữu ích",
    "useful": "hữu ích",
    "effective": "hiệu quả",
    "efficient": "hiệu quả",
    "correctly": "đúng cách",
    "properly": "đúng cách",
    "perfect": "hoàn hảo",
    "possible": "có thể",
    "comfortable": "thoải mái",
    "difficult": "khó",
    "hard": "khó",
    "easy": "dễ",
    "simple": "đơn giản",
    "complex": "phức tạp",
    "challenging": "thử thách",
    "advanced": "nâng cao",
    "beginner": "cơ bản",
    "intermediate": "trung cấp",
    "natural": "tự nhiên",
    "normal": "bình thường",
    "regular": "thường xuyên",
    "frequent": "thường xuyên",
    "occasional": "thỉnh thoảng",
    "daily": "hàng ngày",
    "weekly": "hàng tuần",
    "monthly": "hàng tháng",
    "annual": "hàng năm",
    "male": "nam",
    "female": "nữ",
    "personal": "cá nhân",
    "individual": "cá nhân",
    "specific": "cụ thể",
    "general": "chung",
    "common": "phổ biến",
    "typical": "điển hình",
    "standard": "tiêu chuẩn",
    "basic": "cơ bản",
    "advanced": "nâng cao",

    # Exercise specific equipment
    "dip": "dips",
    "chin": "cằm",
    "pull": "kéo",
    "push": "đẩy",
    "press": "ấn",
    "curl": "cuộn",
    "fly": "ép",
    "row": "kéo cơ",
    "deadlift": "deadlift",
    "squat": "squat",
    "lunge": "chùng chân",
    "plank": "plank",
    "crunch": "gập bụng",
    "bridge": "cầu",
    "shrug": "nhún vai",
    "raise": "nâng",
    "extension": "duỗi",
    "flexion": "gập",
    "rotation": "xoay",
    "adduction": "khép",
    "abduction": "dạng",
    "elevation": "nâng lên",
    "depression": "hạ xuống",
    "protraction": "đưa ra",
    "retraction": "kéo vào",
    "inversion": "đảo ngược",
    "eversion": "lật ngoài",
    "supination": "ngửa",
    "pronation": "sấp",
    "circumduction": "xoay vòng",
    "swing": "vung",
    "thrust": "đẩy",
    "thruster": "trust",
    "clean": "clean",
    "jerk": "jerk",
    "snatch": "snatch",
    "burpee": "burpee",
    "sit-up": "gập bụng",
    "situp": "gập bụng",
    "handstand": "trồng cây chuối",
    "planche": "planche",
    "lever": "cần đòn",
    "flag": "cờ",
    "maltese": "maltese",
    "muscle-up": "muscle up",
    "kip": "kip",
    "turndunk": "turndunk",
    "dunk": "dunk",
    "cartwheel": "bánh xe",
    "handspring": "nhảy chống tay",
    "backflip": "lộn ngược",
    "frontflip": "lộn trước",
    "jump": "nhảy",
    "hop": "nhảy lò cò",
    "skip": "nhảy dây",
    "sprint": "chạy nước rút",
    "jog": "chạy bộ",
    "walk": "đi bộ",
    "march": "đi bộ",
    "climb": "leo",
    "crawl": "bò",
}


def translate_text(text):
    """Translate English exercise instruction text to Vietnamese."""
    if not text:
        return text

    # Remove "Step:X " prefix, translate it separately
    step_match = re.match(r'^(Step:(\d+)\s*)', text)
    step_prefix = ""
    if step_match:
        text = text[step_match.end():]
        step_prefix = f"Bước {step_match.group(2)}: "

    text = text.strip()
    if not text:
        return step_prefix if step_prefix else ""

    # 1. Apply phrase replacements first (longest patterns)
    for pattern, repl in PHRASES.items():
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)

    # 2. Word-by-word translation
    words = re.findall(r"[\w'<>]+|[^\w\s]", text)
    translated_words = []
    for word in words:
        # Check if it's punctuation
        if re.match(r'^[^\w]+$', word):
            translated_words.append(word)
            continue

        # Check dictionary
        lower = word.lower()
        if lower in WORD_DICT:
            vi = WORD_DICT[lower]
            if vi:
                # Preserve capitalization
                if word[0].isupper() and vi:
                    vi = vi[0].upper() + vi[1:]
                translated_words.append(vi)
            # else: skip (empty string = remove articles like "a", "an", "the")
        else:
            # Keep untranslated words as-is
            translated_words.append(word)

    result = ' '.join(translated_words)

    # Clean up extra spaces
    result = re.sub(r'\s+', ' ', result)
    # Remove space before punctuation
    result = re.sub(r'\s+([.,;:!?])', r'\1', result)
    # Remove space after apostrophe/quotes
    result = re.sub(r"'\s+", "'", result)

    # Capitalize first letter
    if result:
        result = result[0].upper() + result[1:]

    # Ensure sentence ends with period
    if result and not result.endswith(('.', '!', '?')):
        result += '.'

    return step_prefix + result


def translate_description(desc, name_vi):
    """Translate description to Vietnamese."""
    if not desc:
        return desc

    # Case 1: Generic Vietnamese already ("Bài tập X. Thực hiện đúng kỹ thuật...")
    if "Thực hiện đúng kỹ thuật" in desc:
        return desc

    # Case 2: Has "Cách thực hiện:" + English
    if "Cách thực hiện:" in desc:
        parts = desc.split("Cách thực hiện:")
        before = parts[0].strip()
        after = parts[1].strip()

        # Check if the "after" part has English
        has_english = bool(re.search(
            r'\b(your|the|a|stand|lie|place|hold|grasp|bend|extend|push|pull|press)\b',
            after, re.IGNORECASE))
        if has_english:
            translated_after = translate_text(after)
            return f"{before}. Cách thực hiện: {translated_after}"
        return desc

    # Case 3: "Bài tập X. Cách thực hiện:" pattern embedded
    # Case 4: Full English description
    has_english = bool(re.search(r'\b(your|the|stand|place|hold)\b', desc, re.IGNORECASE))
    if has_english:
        return f"Bài tập {name_vi}. Cách thực hiện: {translate_text(desc)}"

    return desc


def translate_exercise_name(name):
    """Translate exercise name to Vietnamese using pattern-based approach."""
    if name in EXERCISE_NAME_VI:
        return EXERCISE_NAME_VI[name]

    name_lower = name.lower()
    for k, v in EXERCISE_NAME_VI.items():
        if k.lower() == name_lower:
            return v

    # ── Prefix-based translation ──
    parts = name.split()

    # Equipment prefixes with their Vietnamese form
    PREFIX_MAP = [
        ("Dumbbell", "tạ đơn"), ("Barbell", "tạ đòn"), ("Cable", "cáp"),
        ("Band", "dây kháng lực"), ("Kettlebell", "tạ ấm"),
        ("Smith", "máy Smith"), ("Weighted", "có tạ"),
        ("Lever", "máy đòn bẩy"), ("Sled", "máy trượt"),
        ("Resistance", "dây kháng lực"), ("Ez", "thanh EZ"),
        ("Roller", "con lăn"),
        ("Exercise Ball", "bóng tập"),
        ("Medicine Ball", "bóng thuốc"),
    ]

    prefix_vi = None
    remaining = name
    # Try two-word prefixes first, then single-word
    for prefix, vi in sorted(PREFIX_MAP, key=lambda x: -len(x[0].split())):
        prefix_words = prefix.split()
        pw = len(prefix_words)
        if len(parts) >= pw and ' '.join(parts[:pw]).lower() == prefix.lower():
            remaining = ' '.join(parts[pw:])
            prefix_vi = vi
            break

    # Translate the verb part
    EXERCISE_VERBS = [
        ("Bench Press", "Đẩy ngực"), ("Incline Bench Press", "Đẩy ngực nghiêng"),
        ("Decline Bench Press", "Đẩy ngực dốc"), ("Close-Grip Bench Press", "Đẩy ngực tay hẹp"),
        ("Wide-Grip Bench Press", "Đẩy ngực tay rộng"),
        ("Lat Pulldown", "Kéo xô"), ("Pulldown", "Kéo xô"),
        ("Overhead Press", "Đẩy vai"), ("Shoulder Press", "Đẩy vai"),
        ("Lateral Raise", "Nâng vai ngang"), ("Front Raise", "Nâng vai trước"),
        ("Rear Delt Raise", "Nâng vai sau"), ("Rear Delt Row", "Kéo vai sau"),
        ("Biceps Curl", "Cuộn tay trước"), ("Triceps Extension", "Duỗi tay sau"),
        ("Preacher Curl", "Cuộn tạ trên ghế"), ("Concentration Curl", "Cuộn tạ tập trung"),
        ("Hammer Curl", "Cuộn búa"), ("Calf Raise", "Nhón gót"),
        ("Leg Curl", "Gập đùi"), ("Leg Extension", "Duỗi đùi"),
        ("Leg Press", "Đạp chân"), ("Chest Press", "Đẩy ngực"),
        ("Hip Abduction", "Dạng hông"), ("Hip Adduction", "Khép hông"),
        ("Bent Over Row", "Kéo cúi người"), ("Upright Row", "Kéo đứng"),
        ("Seated Row", "Kéo ngồi"), ("Good Morning", "Good Morning"),
        ("Deadlift", "Deadlift"), ("Romanian Deadlift", "Deadlift Romania"),
        ("Squat", "Squat"), ("Front Squat", "Squat trước"),
        ("Hack Squat", "Hack Squat"), ("Goblet Squat", "Squat Goblet"),
        ("Lunge", "Chùng chân"), ("Step-Up", "Bước lên"),
        ("Curl", "Cuộn tạ"), ("Push-Up", "Chống đẩy"),
        ("Dip", "Dips"), ("Dips", "Dips"),
        ("Pull-Up", "Kéo xà"), ("Pull Up", "Kéo xà"),
        ("Chin-Up", "Kéo xà ngửa tay"), ("Sit-Up", "Gập bụng"),
        ("Crunch", "Gập bụng"), ("Leg Raise", "Nâng chân"),
        ("Triceps Pushdown", "Duỗi tay sau"), ("Pushdown", "Đẩy xuống"),
        ("Stretch", "Căng cơ"), ("Twist", "Xoay"),
        ("Bicep Curl", "Cuộn tay trước"),
        ("Chest Stretch", "Căng cơ ngực"),
        ("Leg Stretch", "Căng cơ chân"),
        ("Back Stretch", "Căng cơ lưng"),
        ("Hip Stretch", "Căng cơ hông"),
        ("Calf Stretch", "Căng bắp chân"),
        ("Hamstring Stretch", "Căng cơ đùi sau"),
        ("Hip Flexor Stretch", "Căng cơ gập hông"),
        ("Lat Stretch", "Căng cơ xô"),
        ("Lying Triceps Extension", "Duỗi tay sau nằm"),
        ("Standing Calf Raise", "Nhón gót đứng"),
        ("Seated Calf Raise", "Nhón gót ngồi"),
        ("One Leg Calf Raise", "Nhón gót một chân"),
        ("Lying Leg Curl", "Gập đùi nằm"),
        ("Standing Leg Curl", "Gập đùi đứng"),
        ("Seated Leg Curl", "Gập đùi ngồi"),
        ("Reverse Hyperextension", "Duỗi lưng ngược"),
        ("Back Extension", "Duỗi lưng"),
        ("Chest Dip", "Dips ngực"),
        ("Triceps Dip", "Dips tay sau"),
        ("Bench Dip", "Dips ghế"),
        ("Bodyweight Squat", "Squat tự trọng"),
        ("Bodyweight Lunge", "Chùng chân tự trọng"),
        ("Bodyweight Row", "Kéo cơ tự trọng"),
        ("Hanging Leg Raise", "Nâng chân treo"),
        ("Hanging Knee Raise", "Nâng gối treo"),
        ("Hanging Straight Leg Raise", "Nâng chân thẳng treo"),
        ("Incline Leg Hip Raise", "Nâng hông chân nghiêng"),
        ("Oblique Crunch", "Gập bụng chéo"),
        ("Decline Crunch", "Gập bụng dốc"),
        ("Decline Sit-Up", "Gập bụng dốc"),
        ("Russian Twist", "Xoay Nga"),
        ("Reverse Crunch", "Gập bụng ngược"),
        ("Jackknife Sit-Up", "Gập bụng gập người"),
        ("Side Plank", "Plank nghiêng"),
        ("Front Plank", "Plank trước"),
        ("Reverse Plank", "Plank ngược"),
        ("Wall Ball", "Ném bóng"),
        ("Box Jump", "Nhảy hộp"),
        ("Plyo Push Up", "Chống đẩy bật"),
        ("Drop Push Up", "Chống đẩy rơi"),
        ("Incline Push-Up", "Chống đẩy nghiêng"),
        ("Decline Push-Up", "Chống đẩy dốc"),
        ("Close-Grip Push-Up", "Chống đẩy tay hẹp"),
        ("Wide Hand Push Up", "Chống đẩy tay rộng"),
        ("Triceps Press", "Duỗi tay sau"),
        ("Hip Raise", "Nâng hông"), ("Bridge", "Cầu"),
        ("Plank", "Plank"), ("Shrug", "Nhún vai"),
        ("Kickback", "Đá sau"), ("Pullover", "Kéo qua đầu"),
        ("Fly", "Ép ngực"), ("Reverse Fly", "Bay ngược"),
        ("Press", "Đẩy"), ("Row", "Kéo cơ"),
        ("Raise", "Nâng"), ("Extension", "Duỗi"),
        ("Curl", "Cuộn"),
    ]

    vi_verb = None
    modifiers = ""
    for verb, vi in sorted(EXERCISE_VERBS, key=lambda x: -len(x[0])):
        if verb.lower() in remaining.lower():
            # Find where the verb starts in remaining
            idx = remaining.lower().index(verb.lower())
            before = remaining[:idx].strip()
            after = remaining[idx + len(verb):].strip()
            modifiers_parts = []
            if before:
                modifiers_parts.append(before)
            if after:
                modifiers_parts.append(after)
            modifiers = ' '.join(modifiers_parts)
            vi_verb = vi
            break

    if vi_verb:
        if modifiers:
            result = f"{vi_verb} {modifiers}"
        else:
            result = vi_verb
    else:
        # Keep original, just capitalize nicely
        result = name

    # Add equipment prefix
    if prefix_vi:
        prepositions = {"tạ đơn", "tạ đòn", "tạ ấm", "thanh EZ", "dây kháng lực", "con lăn"}
        if prefix_vi in prepositions:
            result = f"{result} với {prefix_vi}"
        elif prefix_vi == "máy Smith":
            result = f"{result} trên máy Smith"
        elif prefix_vi == "máy đòn bẩy":
            result = f"{result} trên máy đòn bẩy"
        elif prefix_vi == "máy trượt":
            result = f"{result} trên máy trượt"
        elif prefix_vi == "cáp":
            result = f"{result} với cáp"
        elif prefix_vi == "có tạ":
            result = f"{result} có tạ"
        else:
            result = f"{result} với {prefix_vi}"

    return result


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.normpath(os.path.join(script_dir, '..', 'src', 'lib', 'exercises.json'))

    print(f"Reading: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    exercises = data['exercises']
    total = len(exercises)
    print(f"Total exercises: {total}")

    stats = {
        'name_vi_translated': 0,
        'muscles_vi_filled': 0,
        'muscles_sec_vi_filled': 0,
        'descriptions_translated': 0,
        'instructions_translated': 0,
    }

    for i, e in enumerate(exercises):
        # ── Muscle groups ──
        muscles_vi = [MUSCLES_VI.get(m.strip(), m.strip()) for m in e['muscles'] if m and m.strip()]
        e['muscles_vi'] = muscles_vi
        if muscles_vi: stats['muscles_vi_filled'] += 1

        # ── Secondary muscles ──
        sec_vi = [MUSCLES_VI.get(m.strip(), m.strip()) for m in e['musclesSecondary'] if m and m.strip()]
        e['musclesSecondary_vi'] = sec_vi
        if sec_vi: stats['muscles_sec_vi_filled'] += 1

        # ── Equipment list ──
        equip_vi = [EQUIPMENT_VI.get(eq.strip(), eq.strip()) for eq in e.get('equipmentList', []) if eq and eq.strip()]
        e['equipmentList_vi'] = equip_vi

        # ── Muscle group ──
        mg = e.get('muscleGroup', '')
        if mg in CATEGORY_VI:
            e['muscleGroup_vi'] = CATEGORY_VI[mg]
        elif mg == "Core":
            e['muscleGroup_vi'] = "Cơ trung tâm"
        else:
            e['muscleGroup_vi'] = mg

        # ── Category / Level ──
        e['category_vi'] = CATEGORY_VI.get(e.get('category', ''), e.get('category', ''))
        e['level_vi'] = LEVEL_VI.get(e.get('level', ''), e.get('level', ''))

        # ── Name ──
        name = e['name']
        name_vi = e.get('name_vi', name)
        has_vietnamese = bool(re.findall(r'[àáảãạăắằẵặâấầẫậđèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờỡợùúủũụưứừửữựỳýỷỹỵ]', name_vi, re.IGNORECASE))
        if (not name_vi or name_vi.strip() == name or not has_vietnamese):
            new_name_vi = translate_exercise_name(name)
            if new_name_vi and new_name_vi != name_vi:
                e['name_vi'] = new_name_vi
                name_vi = new_name_vi
                if name_vi != name:
                    stats['name_vi_translated'] += 1
        else:
            name_vi = name_vi.strip()

        # ── Description ──
        old_desc = e.get('description', '')
        new_desc = translate_description(old_desc, name_vi)
        if new_desc != old_desc:
            e['description'] = new_desc
            stats['descriptions_translated'] += 1

        # ── Instructions ──
        instructions = e.get('exerciseDbInstructions', [])
        if instructions:
            translated = [translate_text(instr) for instr in instructions]
            e['exerciseDbInstructions_vi'] = translated
            stats['instructions_translated'] += 1

        if (i + 1) % 200 == 0:
            print(f"  Progress: {i+1}/{total}")

    # Ensure proper key ordering
    KEY_ORDER = [
        'id', 'name', 'name_vi',
        'muscleGroup', 'muscleGroup_vi', 'muscles', 'muscles_vi',
        'musclesSecondary', 'musclesSecondary_vi',
        'level', 'level_vi',
        'equipment', 'equipmentList', 'equipmentList_vi',
        'category', 'category_vi',
        'sets', 'reps', 'restSeconds',
        'description', 'trainer', 'image', 'video',
        'exerciseDbId', 'exerciseDbGif',
        'exerciseDbInstructions', 'exerciseDbInstructions_vi',
    ]
    def sort_keys(ex):
        result = {}
        for k in KEY_ORDER:
            if k in ex:
                result[k] = ex[k]
        for k, v in ex.items():
            if k not in result:
                result[k] = v
        return result

    data['exercises'] = [sort_keys(e) for e in exercises]

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Translation complete!")
    print(f"{'='*50}")
    print(f"  name_vi translated:        {stats['name_vi_translated']}")
    print(f"  muscles_vi filled:         {stats['muscles_vi_filled']}")
    print(f"  musclesSecondary_vi filled: {stats['muscles_sec_vi_filled']}")
    print(f"  descriptions translated:   {stats['descriptions_translated']}")
    print(f"  instructions translated:   {stats['instructions_translated']}")
    print(f"  Output: {json_path}")


if __name__ == '__main__':
    main()
