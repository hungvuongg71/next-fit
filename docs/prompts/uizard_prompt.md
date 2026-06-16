# NextFit - Ứng Dụng Gợi Ý Bài Tập Gym | Uizard Design Prompt

## TỔNG QUAN DỰ ÁN

Thiết kế UX/UI cho **NextFit** - một web app hiện đại giới thiệu bài tập gym được cá nhân hóa dựa trên tiêu chí của người dùng. Ứng dụng hỗ trợ gymer ở mọi trình độ bằng các gợi ý tập thông minh được chạy bởi AI và ghi nhận lịch sử tập luyện.

---

## ĐỊNH HƯỚNG THIẾT KẾ

### Phong Cách

- **Tổng thể**: Tối giản (Minimalist) + Sạch sẽ (Clean)
- **Cảm giác**: Hiện đại, năng động, chuyên nghiệp
- **Đối tượng**: Gymer mọi trình độ (từ beginner đến advanced)

### Bảng Màu (Color Palette)

- **Màu Chủ Đạo (Primary)**: `#2979FF` - Xanh điện (Electric Blue) - dùng cho CTA buttons, highlights
- **Màu Phụ (Secondary)**: `#0F0F14` - Xám tối (Dark Gray) - nền cards, containers nhỏ
- **Màu Nền (Background)**: `#000000` - Đen tuyệt đối - nền chính
- **Màu Nhấn (Accent)**: `#FF007F` - Hồng đậm (Hot Pink) - accents, icons, highlights nhỏ
- **Màu Chữ & Chi Tiết**: `#E0E0E0` - Xám sáng (Light Gray) - text, labels, borders
- **Quy Tắc Phân Bổ Màu**: 60% Background (#000000), 30% Secondary (#0F0F14), 10% Primary + Accent

### Typography

- **Tiêu Đề Lớn (H1, Page Titles)**: Syne, Extra Bold (700+), kích thước 32-48px
- **Các Đề Mục (H2, Section Headers)**: Space Grotesk, Bold (700), kích thước 24-28px
- **Các Chủ Đề Phụ (H3, Card Titles)**: Space Grotesk, Semi-Bold (600), kích thước 18-20px
- **Văn Bản Chính (Body Text)**: Plus Jakarta Sans, Regular (400), kích thước 14-16px
- **Nhãn & Descriptions**: Plus Jakarta Sans, Regular (400), kích thước 12-14px
- **Hiển Thị Số (Sets, Reps, Time)**: Rubik Mono One, Regular (400), kích thước 16-24px

### Spacing & Layout

- **Base Unit**: 8px
- **Padding**: 16px (2 units), 24px (3 units), 32px (4 units)
- **Margin**: 16px (2 units), 24px (3 units), 32px (4 units)
- **Gap (Grid/Flex)**: 16px giữa các items, 24px giữa các sections
- **Border Radius**: 12px cho cards, 8px cho inputs/buttons nhỏ

### Component Styles

- **Buttons**:
  - Primary CTA: Background #2979FF, Text #E0E0E0, Border radius 8px, Padding 12px 24px
  - Secondary: Background #0F0F14, Border 1px #2979FF, Text #2979FF
  - Icon Buttons: 40x40px, circular
  - Hover: Lighten bg 10%, opacity 0.8
- **Cards/Containers**: Background #0F0F14, Border 0px (optional subtle border #2979FF with opacity 0.2), Border radius 12px
- **Input Fields**: Background #1A1A20, Border 1px #2979FF, Border radius 8px, Text #E0E0E0
- **Icons**: Line weight 2px, size 20-24px cho buttons, 16px cho labels

---

## QUY TRÌNH NGƯỜI DÙNG & MÀNG HÌNH

### SCREEN 1: LANDING / ONBOARDING (Lần đầu tiên)

**Tiêu đề**: "Chào mừng đến NextFit"
**Mô tả**: Khi user vào lần đầu tiên, hiển thị màn hình onboarding với:

**Layout**: Full-width, center alignment

- **Section Header** (Syne, 36px, #E0E0E0): "Hôm nay bạn muốn tập gì?"
- **Subtitle** (Plus Jakarta Sans, 14px, #E0E0E0 opacity 70%): "Chọn các tiêu chí để nhận gợi ý bài tập phù hợp nhất"

**Tiêu chí (Criteria Cards)**:
Hiển thị dưới dạng selectable cards (tối thiểu 4 tiêu chí, mỗi tiêu chí có 3-5 lựa chọn):

1. **Cơ Nhóm Target (Target Muscle Group)**
   - Options: Chest, Back, Legs, Shoulders, Arms, Core, Full Body, Cardio
   - Display: Horizontal scrollable row hoặc grid buttons
   - Selected state: Background #2979FF, Text #000000
   - Unselected state: Background #0F0F14, Border 1px #2979FF, Text #E0E0E0

2. **Độ Khó (Difficulty Level)**
   - Options: Beginner, Intermediate, Advanced, Expert
   - Display: Vertical button group
   - Styling: Same as above

3. **Thời Gian Có Sẵn (Available Time)**
   - Options: 15 min, 30 min, 45 min, 60+ min
   - Display: Horizontal button group

4. **Loại Thiết Bị (Equipment)**
   - Options: Barbell, Dumbbell, Machine, Bodyweight, Cable, Mixed
   - Display: Horizontal scrollable row
   - Multi-select enabled (show checkmarks)

5. **Mục Tiêu (Fitness Goal)**
   - Options: Strength, Hypertrophy, Endurance, Weight Loss, Balance
   - Display: Vertical button group

**Action Button**:

- Primary button "Bắt Đầu Tập Hôm Nay" (Start Workout Today)
  - Width: 100% trên mobile, auto trên desktop
  - Position: Fixed bottom trên mobile, static trên desktop
  - Style: #2979FF background, #000000 text, padding 16px 32px
  - Disabled state: opacity 0.5 nếu chưa chọn criteria

---

### SCREEN 2: MAIN / HOME (Recommended Workout)

**Layout**: Mobile-first, single column

- Header area (120px height)
- Scrollable content area
- Fixed bottom button area

**Header Section**:

- **Navigation Bar** (Top, Height 60px):
  - Left: Hamburger menu (3 lines, #E0E0E0)
  - Center: Logo text "NextFit" (Syne, 20px, #2979FF)
  - Right: User profile icon (40x40px circular, bg #0F0F14)

**Main Content**:

1. **Daily Brief Card** (Width 100%, Margin 16px, Background #0F0F14, Padding 20px)
   - **Title** (Space Grotesk, 18px, #2979FF): "Hôm nay của bạn"
   - **Date & Criteria**: "Thứ Hai, 09/06 • Chest • 45 min • Dumbbells"
   - **Sub-button row**:
     - Button "Thay Đổi Tiêu Chí" (Change Criteria, Secondary style, width 48%)
     - Button "Reset" (icon + text, Secondary style, width 48%)

2. **Recommended Exercises List** (Padding 16px, Gap 12px)
   - **Section Title** (Space Grotesk, 20px, #E0E0E0): "4 Bài Tập Hôm Nay"

   **Exercise Card** (Width 100%, Height auto, Background #0F0F14, Padding 16px, Border radius 12px, Border 1px #2979FF opacity 0.3, Gap 12px):
   - **Layout**: Horizontal flex, image left (80px x 80px, border radius 8px), content right (flex-grow)
   - **Image**: Animated GIF placeholder (đen, #FF007F border)
   - **Content**:
     - **Exercise Name** (Space Grotesk, 16px, #E0E0E0, bold): "Dumbbell Bench Press"
     - **Muscle Group + Difficulty** (Plus Jakarta Sans, 12px, #E0E0E0 opacity 70%): "Chest • Intermediate"
     - **Info Row** (Plus Jakarta Sans, 12px, #2979FF):
       - "4 Sets • 8-10 Reps • 60s Rest"
   - **Action Buttons** (Right side, stacked vertically, small):
     - Edit icon button (swap/change exercise, secondary style)
     - Remove icon button (trash/close, background #FF007F opacity 0.2)
   - **Hover State**: Background opacity 0.05 lighten, Border #2979FF opacity 0.6

   **Repeat card design cho 3-4 exercises**

3. **Additional Actions** (Below exercises, Margin top 24px):
   - "Thêm Bài Tập Khác?" (Add Another Exercise?)
   - Button "➕ Thêm" (Add, Secondary style, width 100%)

---

### SCREEN 3: WORKOUT IN PROGRESS

**Layout**: Full-screen, centered, minimal distractions

- Fixed header (60px)
- Large exercise display area (scrollable)
- Fixed bottom buttons

**Header**:

- Left: Back button (icon, #2979FF)
- Center: Progress text "Bài 1 của 4" (Exercise 1 of 4, Syne, 16px)
- Right: Close button (X, #FF007F)

**Main Exercise Display**:

1. **Exercise Header Section** (Padding 24px, Gap 8px):
   - **Exercise Name** (Syne, 32px, #2979FF): "Dumbbell Bench Press"
   - **Target + Difficulty** (Plus Jakarta Sans, 14px, #E0E0E0 opacity 70%): "Chest • Intermediate"

2. **Large Exercise Visual** (Width 100%, Height 300px, Background #0F0F14, Border radius 12px, Margin vertical 16px):
   - GIF/Video placeholder with play icon (white, centered)
   - Option to toggle between GIF và Video (small tab buttons, top right, #2979FF)

3. **Description Section** (Padding 16px, Background #0F0F14, Border radius 12px):
   - **Title** (Space Grotesk, 14px, #2979FF): "Cách Thực Hiện"
   - **Text** (Plus Jakarta Sans, 14px, #E0E0E0, line-height 1.6):
     "1. Nằm trên bench, tay cách nhau...[description text]"

4. **Related Exercises** (Padding 16px, Margin top 16px):
   - **Title** (Space Grotesk, 14px, #2979FF): "Bài Tập Liên Quan"
   - **Horizontal Scroll List** (6 small cards, each 80x80px):
     - Card: Image, name (12px, centered), background #0F0F14
     - On tap: Open exercise detail modal

---

### SCREEN 4: SET & REPS INPUT

**Context**: Displayed inline within exercise card or as expandable section

**Layout**: Card-based, padding 16px

**Section Title** (Space Grotesk, 16px, #2979FF): "Ghi Lại Sets & Reps"

**Sets List** (Gap 12px between each):

**Set Card** (Background #0F0F14, Padding 12px, Border radius 8px, Border 1px #2979FF opacity 0.3):

- **Layout**: Horizontal flex
- **Left Section**:
  - Label "Set 1" (Rubik Mono One, 16px, #FF007F)
- **Middle Section** (flex-grow, Gap 8px):
  - **Input Field** (Width 60px, label "Reps", Plus Jakarta Sans 12px):
    - Placeholder: "10"
    - Type: Number input, background #1A1A20, border #2979FF, text #E0E0E0
  - **Dropdown** (Width 80px, label "x", Rubik Mono One 14px):
    - Default: "Default" hoặc show kg/lb
- **Right Section**:
  - **Checkmark Button** (40x40px, circular, background #2979FF, icon white, on press: highlight row)

**Button Row** (Gap 8px, Margin top 12px):

- Button "➕ Thêm Set" (Add Set, Secondary, flex-grow)
- Button "↩️ Xóa Set" (Remove Set, Secondary, flex-grow, only shows if > 1 set)

---

### SCREEN 5: REST TIMER

**Display Context**: Show after user checks/confirms reps for a set

**Modal/Overlay** (Full-width, Height 240px, Background gradient #0F0F14 to #1A1A20, Border radius 12px top)

**Content** (Centered, Padding 24px):

1. **Timer Circle** (Width 120px, Height 120px, centered):
   - Circular progress indicator (stroke #2979FF, bg #0F0F14)
   - **Center Number** (Rubik Mono One, 40px, #2979FF): "45"
   - **Sub-text** (Plus Jakarta Sans, 12px, #E0E0E0): "seconds"

2. **Timer Controls** (Below circle, Gap 16px, horizontal):
   - Button "➖ 15s" (Minus, Secondary, width 48%)
   - Button "➕ 15s" (Plus, Secondary, width 48%)
   - Text below (Plus Jakarta Sans, 12px, #E0E0E0 opacity 70%): "Default: 60s"

3. **Action Button** (Width 100%, Margin top 16px):
   - Primary: "Sẵn Sàng?" (Ready?, width 100%) - appears when timer < 5s left
   - Or: "Bỏ Qua" (Skip, Secondary) - always available

---

### SCREEN 6: EXERCISE DETAIL MODAL

**Trigger**: Click on exercise card or related exercise thumbnail

**Modal** (Width 100% mobile, 600px desktop, Background #000000, Border 1px #2979FF opacity 0.3)

**Header** (Padding 16px, Border-bottom 1px #2979FF opacity 0.2):

- **Title** (Syne, 24px, #2979FF): "Dumbbell Bench Press"
- **Close button** (Right, X icon, #E0E0E0)

**Content** (Scrollable, Padding 16px):

1. **Media Section** (Height 300px, Background #0F0F14, Border radius 12px, Margin bottom 16px):
   - **Tab Navigation** (2 tabs, Gap 8px, below content):
     - Tab 1: "GIF" (animated, default active, #2979FF underline)
     - Tab 2: "Video" (#E0E0E0)
   - **Content**: Large GIF/Video with play icon

2. **Description Section**:
   - **Title** (Space Grotesk, 16px, #2979FF): "Cách Thực Hiện"
   - **Text** (Plus Jakarta Sans, 14px, #E0E0E0, line-height 1.6):
     "Hướng dẫn chi tiết về cách thực hiện bài tập..."

3. **Related Exercises** (Margin top 16px):
   - **Title** (Space Grotesk, 16px, #2979FF): "Bài Tập Liên Quan"
   - **Grid** (2 columns mobile, 3 columns desktop, Gap 12px):
     - **Related Card** (each, Height 120px, Background #0F0F14, Border radius 8px, Padding 12px):
       - **Image** (100%, Height 60px, Border radius 4px)
       - **Title** (Plus Jakarta Sans, 12px, #E0E0E0, text-center): "Barbell Bench Press"

---

### SCREEN 7: WORKOUT COMPLETION

**Trigger**: User completes all sets/reps and presses "Hoàn Thành" button

**Modal/Full Screen** (Background #000000, Centered content)

**Content** (Centered, Padding 24px):

1. **Celebration Icon** (60x60px, animated, #FF007F):
   - Trophy icon or confetti animation (suggest Lottie animation)

2. **Main Message** (Syne, 32px, #2979FF, text-align center):
   "Tuyệt Vời!"
   (Great!)

3. **Subtext** (Plus Jakarta Sans, 16px, #E0E0E0 opacity 80%, text-align center):
   "Bạn đã hoàn thành 4 bài tập hôm nay\nTiếp tục duy trì nhé! 💪"

4. **Statistics Card** (Background #0F0F14, Padding 20px, Border radius 12px, Margin 24px 0, Width 100%):
   - **Grid** (2 columns, Gap 16px):
     - **Stat Box**:
       - Number (Rubik Mono One, 24px, #2979FF): "4"
       - Label (Plus Jakarta Sans, 12px, #E0E0E0): "Exercises"
     - **Stat Box**:
       - Number (Rubik Mono One, 24px, #2979FF): "18"
       - Label (Plus Jakarta Sans, 12px, #E0E0E0): "Total Sets"

5. **Action Buttons** (Gap 12px, Width 100%):
   - Primary Button (Width 100%, #2979FF): "Quay Lại Trang Chính" (Back to Home)
   - Secondary Button (Width 100%): "Xem Chi Tiết" (View Details)

---

### SCREEN 8: BOTTOM NAVIGATION (Mobile)

**Position**: Fixed bottom, Height 70px
**Background**: #0F0F14, Border-top 1px #2979FF opacity 0.3

**Content** (Horizontal flex, space-around, Padding 8px):

- **Nav Item** (each, Flex-center, Gap 4px, Padding 8px):
  - **Icon** (24x24px, #E0E0E0 or #2979FF if active):
    - Home icon
    - Dumbbell/Workout icon
    - Chart/Analytics icon
    - Profile icon
  - **Label** (Plus Jakarta Sans, 10px, #E0E0E0 or #2979FF):
    - "Home"
    - "Workout"
    - "Stats"
    - "Profile"
  - **Active State**: Icon + label #2979FF, background #2979FF opacity 0.1

---

### SCREEN 9: DRAWER MENU (Mobile)

**Trigger**: Hamburger menu icon
**Position**: Slide from left, Width 280px
**Background**: #0F0F14
**Overlay**: #000000 opacity 0.7

**Header** (Padding 16px, Border-bottom 1px #2979FF opacity 0.3):

- **Logo** (Syne, 20px, #2979FF): "NextFit"
- **Close Icon** (Right, X, #E0E0E0)

**Menu Items** (Padding 16px, Gap 8px):

- **Menu Item** (each, Padding 12px, Border radius 8px, flex row, Gap 12px):
  - Icon (20x20px, #E0E0E0)
  - Text (Plus Jakarta Sans, 14px, #E0E0E0)
  - Items: Home, Workout History, Settings, About, Logout
  - Hover: Background #2979FF opacity 0.1

---

### SCREEN 10: COOKIE CONSENT BANNER

**Position**: Fixed bottom, Width 100%, Background #0F0F14, Border-top 1px #2979FF opacity 0.3
**Padding**: 16px
**Display**: Show on first visit

**Content** (Padding 12px):

- **Title** (Plus Jakarta Sans, 12px, #E0E0E0, bold): "Sử Dụng Cookies"
- **Description** (Plus Jakarta Sans, 11px, #E0E0E0 opacity 70%): "Chúng tôi sử dụng cookies để lưu trữ thông tin..."
- **Buttons** (Gap 8px, Margin top 12px):
  - Button "Từ Chối" (Reject, Secondary, width 48%)
  - Button "Chấp Nhận" (Accept, Primary, width 48%)

---

## RESPONSIVE DESIGN SPECIFICATIONS

### Mobile (< 768px)

- **Layout**: Single column (1 col)
- **Padding**: 16px (screen padding)
- **Button Width**: 100% (full-width) for primary CTAs
- **Navigation**: Bottom navigation bar + hamburger menu
- **Card Grid**: 1 column
- **Font Sizes**: Base (14px for body)
- **Touch Targets**: Minimum 44x44px for interactive elements

### Tablet (768px - 1024px)

- **Layout**: 2 columns for exercise lists
- **Padding**: 24px (screen padding)
- **Button Width**: Auto width for primary CTAs, grouped with gap
- **Navigation**: Collapsible sidebar (toggle with hamburger) or bottom nav
- **Card Grid**: 2 columns
- **Font Sizes**: Increased by 1-2px
- **Touch Targets**: 40x40px minimum

### Desktop (> 1024px)

- **Layout**: 3-4 columns grid for exercises
- **Padding**: 32px (screen padding), 24px (internal padding)
- **Button Width**: Auto width, compact (e.g., "48%" for two-in-a-row)
- **Navigation**: Fixed sidebar (200px) or top navigation
- **Card Grid**: 3-4 columns (adjustable)
- **Font Sizes**: Base sizes as defined above
- **Touch Targets**: 40x40px
- **Secondary Panel**: Optional right sidebar (30% width) for stats/details

---

## ANIMATION & MICRO-INTERACTIONS

- **Button Hover**: Lighten/darken by 10%, scale 0.98
- **Button Click**: Ripple effect or scale 0.95 briefly
- **Card Hover**: Shadow increase, background opacity up
- **Tab Switch**: Smooth fade (200ms)
- **Set Highlight**: Pulse animation or border glow (gold/accent)
- **Timer Countdown**: Smooth number transitions (no jump)
- **Rest Timer**: Circular progress fills smoothly
- **Modal Entrance**: Slide up + fade (300ms easing ease-out)
- **Exercise List**: Stagger animation for cards (100ms offset each)
- **Icon Transitions**: Rotate/scale changes (150ms)

---

## DESIGN SYSTEM NOTES FOR UIZARD

### Color Tokens

- **Interactive**: #2979FF (buttons, active states, links)
- **Destructive**: #FF007F (remove, negative actions)
- **Success**: Consider green (#10B981) for completed states
- **Warning**: Consider amber (#F59E0B) for cautions
- **Neutral**: #E0E0E0, #0F0F14, #000000

### Spacing Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Border Radius Scale

- sm: 4px
- md: 8px
- lg: 12px

### Shadow System

- **Subtle**: box-shadow: 0 1px 3px rgba(0,0,0,0.3)
- **Medium**: box-shadow: 0 4px 12px rgba(0,0,0,0.4)
- **Large**: box-shadow: 0 10px 30px rgba(0,0,0,0.5)

### Opacity Usage

- **Disabled**: opacity 0.5
- **Hover**: opacity 0.8
- **Subtle Text**: opacity 0.6-0.7
- **Border/Divider**: opacity 0.2-0.3

---

## ADMIN DASHBOARD (Secondary Flow - Optional)

If including admin features:

- Separate view/mode for managing exercises, criteria, and user workouts
- Similar design language but with tabular data layouts
- CRUD interfaces for exercise management (name, GIF, video, description)
- Criteria editor (add/edit/delete muscle groups, difficulty levels, etc.)
- User management and history viewing

---

## DESIGN DELIVERABLES FOR UIZARD

1. **Landing / Onboarding Screen** (Criteria Selection)
2. **Main Home Screen** (Recommended Workout List)
3. **Workout In Progress Screen** (Exercise Display + Set/Reps Input)
4. **Rest Timer Modal**
5. **Exercise Detail Modal** (with tabs: GIF, Video, Description, Related)
6. **Workout Completion Screen** (Celebration)
7. **Mobile Bottom Navigation**
8. **Drawer Menu**
9. **Cookie Consent Banner**
10. **Desktop Layout Variant** (3-4 column grid, sidebar nav)

---

## NOTES FOR UIZARD GENERATION

- Prioritize **mobile-first** design; ensure all screens are responsive
- Use the exact color codes provided (#2979FF, #0F0F14, #000000, #FF007F, #E0E0E0)
- Ensure **readability** with high contrast text
- **Icon style**: Line-based, 2px stroke weight, consistent sizing (16-24px)
- **Imagery placeholders**: Dark backgrounds with accent-colored borders for GIFs/videos
- **Animation cues**: Add notes for smooth transitions (e.g., "fade in 300ms")
- **Accessibility**: Include aria-labels, alt-text placeholders, sufficient color contrast
- Generate **interactive** prototypes with clickable flows between screens
- **Fonts**: Use web-safe alternatives or mention font imports (Google Fonts: Syne, Space Grotesk, Plus Jakarta Sans, Rubik Mono One)

---

## ADDITIONAL FEATURES (Future Phases)

- User authentication (login/signup - currently under development)
- Workout history analytics (charts, calendar view)
- Social features (share workouts, challenge friends)
- Customization options (theme, notifications)
- Integration with wearables (heart rate, calories)
- Offline mode support

---

**End of Uizard Prompt**

---

_Prompt này được thiết kế dựa trên 20 năm kinh nghiệm UX/UI design. Nó cung cấp đủ chi tiết để Uizard AI có thể tạo ra một thiết kế UI hoàn chỉnh, consistent, và responsive cho ứng dụng NextFit._
