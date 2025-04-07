import { RadioGroup } from 'react-aria-components';
import Radio from '../../lib/components/Radio';
import FieldSet from './FieldSet';
import Slider from '../../lib/components/Slider';
import type { DNAData } from './utils';
import { faceNames } from './data';

interface Props {
  data: DNAData;
  onGenderChange: (value: 'male' | 'female') => void;
  onDrag: (field: keyof DNAData, values: number[]) => void;
}

const facesMax = faceNames.length - 1;

export default function DNA({ data, onDrag, onGenderChange }: Props) {
  function SliderStats({ field, label, max }: { field: keyof DNAData; label: string; max: number }) {
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
      <FieldSet title="Gender">
        <RadioGroup
          aria-label="Gender"
          className="flex gap-8 mx-auto w-fit"
          onChange={(value) => onGenderChange(value as 'male' | 'female')}
          defaultValue={data.gender}
        >
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </RadioGroup>
      </FieldSet>
      <FieldSet title="Mother & Father">
        <div className="space-y-2">
          <SliderStats field="mother" label="Mother" max={facesMax} />
          <Slider
            id="mother"
            values={data.mother}
            min={0}
            max={facesMax}
            step={1}
            onDrag={(values) => onDrag('mother', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{faceNames[data.mother[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="father" label="Father" max={facesMax} />
          <Slider
            id="father"
            values={data.father}
            min={0}
            max={facesMax}
            step={1}
            onDrag={(values) => onDrag('father', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{faceNames[data.father[0]]}</p>
        </div>
      </FieldSet>
      <FieldSet title="Mother & Father Skin">
        <div className="space-y-2">
          <SliderStats field="motherSkin" label="Mother Skin" max={facesMax} />
          <Slider
            id="motherSkin"
            values={data.motherSkin}
            min={0}
            max={facesMax}
            step={1}
            onDrag={(values) => onDrag('motherSkin', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{faceNames[data.motherSkin[0]]}</p>
        </div>
        <div className="space-y-2">
          <SliderStats field="fatherSkin" label="Father Skin" max={facesMax} />
          <Slider
            id="fatherSkin"
            values={data.fatherSkin}
            min={0}
            max={facesMax}
            step={1}
            onDrag={(values) => onDrag('fatherSkin', values)}
          />
          <p className="text-sm font-bold text-center text-fg-3">{faceNames[data.fatherSkin[0]]}</p>
        </div>
      </FieldSet>
      <FieldSet title="Mix">
        <div className="space-y-2">
          <SliderStats field="faceMix" label="Face Mix" max={1} />
          <Slider
            id="faceMix"
            values={data.faceMix}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) =>
              onDrag(
                'faceMix',
                values.map((x) => Math.round(x * 10) / 10)
              )
            }
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="skinMix" label="Skin Mix" max={1} />
          <Slider
            id="skinMix"
            values={data.skinMix}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) =>
              onDrag(
                'skinMix',
                values.map((x) => Math.round(x * 10) / 10)
              )
            }
          />
        </div>
      </FieldSet>
      <FieldSet title="Others">
        <div className="space-y-2">
          <SliderStats field="eyesColor" label="Eyes Color" max={30} />
          <Slider
            id="eyesColor"
            values={data.eyesColor}
            min={0}
            max={30}
            step={1}
            onDrag={(values) => onDrag('eyesColor', values)}
          />
        </div>
      </FieldSet>
    </div>
  );
}
