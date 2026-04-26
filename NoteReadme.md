# setup 
npx create-expo-app@latest --template default@sdk-54 ./

npx create-expo-app@latest → Runs the latest Expo app generator without installing it globally
--template default@sdk-54 → Uses the default Expo template with SDK version 54

<<<<<<< HEAD

=======
>>>>>>> 93a1e9cd4b43e501900e1b677cb4b908f7c5ff12
### Clear project : npm run reset-project 

### Setup the NativeWind aka Tailwind 
**Nativewind**
It converts className="..." into real React Native styles behind the scenes. 
- https://www.nativewind.dev/v5
- Install Nativewind ``npx expo install nativewind@preview react-native-css react-native-reanimated react-native-safe-area-context``
- setup tailwindcss ``npx expo install --dev tailwindcss @tailwindcss/postcss postcss`` 
- create postcss.config.mjs : paste content from site 
- create global.css : paste content 
- create metro by cmd``npx expo customize metro.config.js `` and update
- Import global css in layout.tsx or main file 
- override the lightningcss version 
- create nativewind-env.d.ts and paste from site 
- try it out by pasing code in index.tsx

### Fresh npm install needed
- ``rm -rf node_modules package-lock.json``
- ``npm install``

### Use Global.css from kit

### Routing 
- just create newpage.tsx and use them as link by expo router as navigation 

### Route grops like : (auth) 
- a folder thats group your screens
- Wont be added to url aka path yeahh😅
- What it is use for : **Organization** 🤣


### Also get the assets folder and  replace 

### Constant setup 
- create constants > add icons.ts from kit = we achive just to easily use icon from name thats it 
- add data.ts in side constant = gives tabs with icon
- create image.d.ts  from kit = tell  ts how to read image
- add type.d.ts for extra type scripts descriptions 



### Install ``npm i clsx``  to modify styles of tab bar 
### Install ``npm i react-native-safe-area-context`` 


# Why `className` didn't work on `SafeAreaView`
## Rule to remember

If `className` not working:

### Step 1

Check if component is from `react-native`

If yes → should work normally.

### Step 2

If from external library:

```jsx
styled(Component)
```

Examples:

* react-native-safe-area-context
* react-native-svg
* react-navigation custom components
* third-party UI libs

---

## Quick fix formula

```jsx
import { styled } from "nativewind";
const MyComponent = styled(OriginalComponent);
```

Done. Your CSS speaks Tailwind now 😎
- What it is use for : **Organization** 🤣
