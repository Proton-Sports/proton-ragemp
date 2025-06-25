import FieldSet from './FieldSet';
import Slider from '../../lib/components/Slider';
import { roundedFloat, type HairData } from './utils';
import { eyebrowNames, facialHairs, femaleHairs, hairColors, maleHairs } from './data';

interface Props {
  gender: 'male' | 'female';
  data: HairData;
  onDrag: (field: keyof HairData, values: number[]) => void;
}

const hairColorsMax = hairColors.length - 1;
const eyeBrowsMax = eyebrowNames.length - 1;

export default function Hair({ gender, data, onDrag }: Props) {
  const hairs = gender === 'male' ? maleHairs : femaleHairs;
  const hairsMax = hairs.length - 1;

  function SliderStats({ field, label, max }: { field: keyof HairData; label: string; max: number }) {
    return (
      <div className="flex justify-between">
        <label htmlFor={field} className="text-base">
          {label}
        </label>
        <span>
          {data[field][0]}/{max}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FieldSet title="Hair" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="hair" label="Drawable" max={hairsMax} />
          <Slider
            id="hair"
            values={data.hair}
            min={0}
            max={hairsMax}
            step={1}
            onChange={(values) => onDrag('hair', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairs[data.hair[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="hairColor1" label="Primary color" max={hairColorsMax} />
          <Slider
            id="hairColor1"
            values={data.hairColor1}
            min={0}
            max={hairColorsMax}
            step={1}
            onChange={(values) => onDrag('hairColor1', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairColors[data.hairColor1[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="hairColor2" label="Secondary color" max={hairColorsMax} />
          <Slider
            id="hairColor2"
            values={data.hairColor2}
            min={0}
            max={hairColorsMax}
            step={1}
            onChange={(values) => onDrag('hairColor2', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairColors[data.hairColor2[0]]}</p>
        </div>
      </FieldSet>
      <FieldSet title="Facial Hair" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="facialHair" label="Drawable" max={20} />
          <Slider
            id="facialHair"
            values={data.facialHair}
            min={0}
            max={facialHairs.length - 1}
            step={1}
            onChange={(values) => onDrag('facialHair', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{facialHairs[data.facialHair[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="facialHairColor1" label="Primary color" max={hairColorsMax} />
          <Slider
            id="facialHairColor1"
            values={data.facialHairColor1}
            min={0}
            max={hairColorsMax}
            step={1}
            onChange={(values) => onDrag('facialHairColor1', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairColors[data.facialHairColor1[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="facialHairColor2" label="Secondary color" max={hairColorsMax} />
          <Slider
            id="facialHairColor2"
            values={data.facialHairColor2}
            min={0}
            max={hairColorsMax}
            step={1}
            onChange={(values) => onDrag('facialHairColor2', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairColors[data.facialHairColor2[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="facialHairOpacity" label="Opacity" max={1} />
          <Slider
            id="facialHairOpacity"
            values={data.facialHairOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('facialHairOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Eyebrows" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="eyeBrows" label="Type" max={eyeBrowsMax} />
          <Slider
            id="eyeBrows"
            values={data.eyeBrows}
            min={0}
            max={eyeBrowsMax}
            step={1}
            onChange={(values) => onDrag('eyeBrows', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{eyebrowNames[data.eyeBrows[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="eyeBrowsColor" label="Color" max={hairColorsMax} />
          <Slider
            id="eyeBrowsColor"
            values={data.eyeBrowsColor}
            min={0}
            max={hairColorsMax}
            step={1}
            onChange={(values) => onDrag('eyeBrowsColor', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{hairColors[data.eyeBrowsColor[0]]}</p>
        </div>
      </FieldSet>
    </div>
  );
}
