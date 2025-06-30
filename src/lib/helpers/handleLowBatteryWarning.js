const handleLowBatteryWarning = async () => {
  const battery = await navigator.getBattery();
  if (battery.level < 0.3) {
    console.log(`Low Battery Level May Affect Performance. \nBattery level: ${battery.level * 100}%`);
    // future: toast.warning("Low battery may affect performance.")
  }
};

export default handleLowBatteryWarning;
