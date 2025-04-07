import { useState, useEffect } from 'react';
import Checkbox from '../../lib/components/Checkbox';

export default function Settings() {
  useEffect(() => {
    alt.emit('nametagsClient:getSetting');
  }, []);

  const [value, setValue] = useState(false);
  const handleChange = (isSelected: boolean) => {
    setValue(isSelected);
    alt.emit('nametagsClient:setSetting', isSelected, false);
  };

  alt.on('settings-nametags:setValue', (isSelected: boolean) => {
    setValue(isSelected);
  });

  return (
    <div className="fixed p-8 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-bg-2 w-[56rem] rounded-xl">
      <div className="space-x-2">
        <Checkbox id="nametags" name="nametags" isSelected={value} onChange={handleChange}>
          Show Nametags
        </Checkbox>
      </div>
    </div>
  );
}
