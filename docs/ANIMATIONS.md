# Website Animations Documentation (ScholarHub)

This document is the central catalog for documenting, understanding, and learning all premium animations implemented across the website. If you create new animations in the future, please append their explanations to this document.

---

## 🎨 General Animation Guidelines (Design Principles)

Before creating any new animations, follow these core principles to ensure the interface feels smooth and responsive:
1. **UI Speed**: Functional UI animations (dropdowns, button clicks, tabs) should ideally stay under **300ms** (recommended: **150ms - 250ms**).
2. **Easing Curves**: Always use *ease-out* for entering elements (provides instant & responsive feedback) and physics-based spring curves for interactive elements. Never use *ease-in* for UI transitions as it delays initial movement and feels sluggish.
3. **Interactivity**: All clickable elements must have a subtle press feedback (e.g., `:active { transform: scale(0.97) }`).
4. **Hardware Acceleration**: Prioritize animating `transform` and `opacity` properties in Framer Motion to bypass layout recalculations and maintain 60/120fps across all devices.

---

## 🚀 Animations Catalog

### 1. macOS App-Style Zoom (Modal / Popover)

This transition mimics the macOS application opening sequence, where the modal window scales out elastically directly from the center point of the trigger button (rather than just scaling from the center of the viewport) and shrinks back into the same button coordinates upon closure.

#### 📂 Associated Files
* **Dynamic Origin Hook:** [useMacOsAppZoom.ts](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/hooks/useMacOsAppZoom.ts)
* **Configuration Constants & Spring Physics:** [macOsZoomAnimations.ts](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/lib/macOsZoomAnimations.ts)
* **Live Reference (Usecase):** Implemented in the comparison modal, see [CompareCTA.tsx](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/components/CompareCTA.tsx) (trigger element tracking coordinates) and [ScholarshipCompareModal.tsx](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/components/ScholarshipCompareModal.tsx) (modal element setting origin).

#### ⚙️ Technical Mechanics
1. **Trigger Coordinates**: When clicked, the trigger button captures its center point coordinates `(x, y)` in the viewport using `getBoundingClientRect()` and passes them via props to the modal as `buttonCenter`.
2. **Dynamic Origin Calculation**: The modal uses the `useMacOsAppZoom(modalRef, buttonCenter)` hook, which computes the relative offset of the button center relative to the modal's top-left corner using un-transformed layout properties (`offsetWidth` and `offsetHeight`).
3. **Animate Presence**: The modal must be wrapped in `<AnimatePresence>` at the parent level so the exit transition (shrinking back into the button) completes before it is unmounted from the DOM.

#### 📝 Implementation Example (Integration Template)

##### Step A: On the Trigger Component
```tsx
import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MyModal from './MyModal';

export default function MyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonCenter, setButtonCenter] = useState<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsOpen(true);
  };

  return (
    <>
      <button ref={buttonRef} onClick={handleOpen}>Compare</button>

      <AnimatePresence>
        {isOpen && (
          <MyModal buttonCenter={buttonCenter} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
```

##### Step B: On the Modal Component
```tsx
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useMacOsAppZoom } from '@/hooks/useMacOsAppZoom';
import { macOSZoomTransition, backdropVariants, modalZoomVariants } from '@/lib/macOsZoomAnimations';

interface Props {
  buttonCenter: { x: number; y: number } | null;
  onClose: () => void;
}

export default function MyModal({ buttonCenter, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const transformOrigin = useMacOsAppZoom(modalRef, buttonCenter);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <motion.div
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        ref={modalRef}
        variants={modalZoomVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={macOSZoomTransition}
        style={{ transformOrigin }}
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl p-6"
      >
        <h4>Modal Content</h4>
      </motion.div>
    </motion.div>,
    document.body
  );
}
```

---

### 2. useBodyScrollLock (Page Scroll Lock Hook)

This hook simplifies locking/unlocking the page scroll (body and html elements) when modal overlays, sidebar menus, or full-screen dashboards are open.

#### 📂 Associated Files
* **Hook File:** [useBodyScrollLock.ts](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/hooks/useBodyScrollLock.ts)
* **Live Reference (Usecase):** Lock applied to the comparison modal during rendering, see [ScholarshipCompareModal.tsx](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/components/ScholarshipCompareModal.tsx#L154).

#### 📝 Implementation Example
Simply call the hook inside the component where the overlay/modal is rendered, passing a boolean indicating whether the lock should be active.

```tsx
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface Props {
  isOpen: boolean;
}

export default function MyOverlay({ isOpen }: Props) {
  // Automatically locks scroll on open, and restores it on close/unmount
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50">Overlay content</div>;
}
```

---

### 3. StaggerContainer & StaggerItem (Sequential List Animations)

Coordinates staggered entrance animations (fade-in & slide-up) for a grid or list of children (e.g. cards, list items) as they scroll into view.

#### 📂 Associated Files
* **Component File:** [StaggerContainer.tsx](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/components/StaggerContainer.tsx)
* **Live Reference (Usecase):** Used to stagger the entrance cards on scroll, see [LatestPosts.tsx](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/src/components/LatestPosts.tsx#L37-L43).

#### ⚙️ Technical Mechanics
* Uses Framer Motion's orchestration parameters (`staggerChildren: 0.06`). The parent triggers `whileInView="animate"`, which propagates down to all children containing the child variants automatically, removing the need for manual delay index multipliers (`idx * 0.05`).
* Optimizes scroll-based entrance rendering by triggering animations only when elements enter the viewport (`viewport={{ once: true, margin: '-50px' }}`).

#### 📝 Implementation Example

```tsx
import { StaggerContainer, StaggerItem } from '@/components/StaggerContainer';

export default function MyList({ items }) {
  return (
    <StaggerContainer className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <StaggerItem key={item.id} className="bg-white p-4 border rounded-xl">
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

---

### 4. [Add New Animation Name Here]

*Feel free to document new transition effects here when you implement them in the future!*
