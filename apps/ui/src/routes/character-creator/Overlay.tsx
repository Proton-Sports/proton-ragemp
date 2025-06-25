import FieldSet from './FieldSet';
import Slider from '../../lib/components/Slider';
import { roundedFloat, type OverlayData } from './utils';
import { overlays } from './data';

interface Props {
  data: OverlayData;
  onDrag: (field: keyof OverlayData, values: number[]) => void;
}

export default function Overlay({ data, onDrag }: Props) {
  function SliderStats({ field, label, max }: { field: keyof OverlayData; label: string; max: number }) {
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
      <FieldSet title="Blemish" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="blemish" label="Type" max={overlays.blemish.max} />
          <Slider
            id="blemish"
            values={data.blemish}
            min={0}
            max={overlays.blemish.max}
            step={1}
            onChange={(values) => onDrag('blemish', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="blemishOpacity" label="Opacity" max={1} />
          <Slider
            id="blemishOpacity"
            values={data.blemishOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('blemishOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Ageing" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="ageing" label="Type" max={overlays.ageing.max} />
          <Slider
            id="ageing"
            values={data.ageing}
            min={0}
            max={overlays.ageing.max}
            step={1}
            onChange={(values) => onDrag('ageing', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="ageingOpacity" label="Opacity" max={1} />
          <Slider
            id="ageingOpacity"
            values={data.ageingOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('ageingOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Complexion" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="complexion" label="Type" max={overlays.complexion.max} />
          <Slider
            id="complexion"
            values={data.complexion}
            min={0}
            max={overlays.complexion.max}
            step={1}
            onChange={(values) => onDrag('complexion', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="complexionOpacity" label="Opacity" max={1} />
          <Slider
            id="complexionOpacity"
            values={data.complexionOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('complexionOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Sun Damage" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="sunDamage" label="Type" max={overlays.sunDamage.max} />
          <Slider
            id="sunDamage"
            values={data.sunDamage}
            min={0}
            max={overlays.sunDamage.max}
            step={1}
            onChange={(values) => onDrag('sunDamage', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="sunDamageOpacity" label="Opacity" max={1} />
          <Slider
            id="sunDamageOpacity"
            values={data.sunDamageOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('sunDamageOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Freckles" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="freckles" label="Type" max={overlays.freckles.max} />
          <Slider
            id="freckles"
            values={data.freckles}
            min={0}
            max={overlays.freckles.max}
            step={1}
            onChange={(values) => onDrag('freckles', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="frecklesOpacity" label="Opacity" max={1} />
          <Slider
            id="frecklesOpacity"
            values={data.frecklesOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('frecklesOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Body Blemish" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="bodyBlemish" label="Type" max={overlays.bodyBlemish.max} />
          <Slider
            id="bodyBlemish"
            values={data.bodyBlemish}
            min={0}
            max={overlays.bodyBlemish.max}
            step={1}
            onChange={(values) => onDrag('bodyBlemish', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="bodyBlemishOpacity" label="Opacity" max={1} />
          <Slider
            id="bodyBlemishOpacity"
            values={data.bodyBlemishOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('bodyBlemishOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Blush" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="blush" label="Type" max={overlays.blush.max} />
          <Slider
            id="blush"
            values={data.blush}
            min={0}
            max={overlays.blush.max}
            step={1}
            onChange={(values) => onDrag('blush', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="blushOpacity" label="Opacity" max={1} />
          <Slider
            id="blushOpacity"
            values={data.blushOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('blushOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
      <FieldSet title="Lipstick" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="lipstick" label="Type" max={overlays.lipstick.max} />
          <Slider
            id="lipstick"
            values={data.lipstick}
            min={0}
            max={overlays.lipstick.max}
            step={1}
            onChange={(values) => onDrag('lipstick', values)}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="lipstickOpacity" label="Opacity" max={1} />
          <Slider
            id="lipstickOpacity"
            values={data.lipstickOpacity}
            min={0}
            max={1}
            step={0.05}
            onChange={(values) => onDrag('lipstickOpacity', roundedFloat(values))}
            showProgress
          />
        </div>
      </FieldSet>
    </div>
  );
}
