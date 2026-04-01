# setup 
npx create-expo-app@latest --template default@sdk-54 ./

npx create-expo-app@latest → Runs the latest Expo app generator without installing it globally
--template default@sdk-54 → Uses the default Expo template with SDK version 54

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