import FieldSet from './FieldSet';
import Slider from '../../lib/components/Slider';
import { roundedFloat, type FaceData } from './utils';

interface Props {
  data: FaceData;
  onDrag: (field: keyof FaceData, values: number[]) => void;
}

export default function Face({ data, onDrag }: Props) {
  function SliderStats({ field, label, max }: { field: keyof FaceData; label: string; max: number }) {
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
      <FieldSet title="Nose" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="noseWidth" label="Width" max={1} />
          <Slider
            id="noseWidth"
            values={data.noseWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('noseWidth', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="noseHeight" label="Height" max={1} />
          <Slider
            id="noseHeight"
            values={data.noseHeight}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('noseHeight', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="noseLength" label="Length" max={1} />
          <Slider
            id="noseLength"
            values={data.noseLength}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('noseLength', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="noseTip" label="Tip" max={1} />
          <Slider
            id="noseTip"
            values={data.noseTip}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('noseTip', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="noseBridgeShaft" label="Bridge shaft" max={1} />
          <Slider
            id="noseBridgeShaft"
            values={data.noseBridgeShaft}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('noseBridgeShaft', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Brow" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="browWidth" label="Width" max={1} />
          <Slider
            id="browWidth"
            values={data.browWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('browWidth', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="browHeight" label="Height" max={1} />
          <Slider
            id="browHeight"
            values={data.browHeight}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('browHeight', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Cheek Bone" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="cheekBoneWidth" label="Width" max={1} />
          <Slider
            id="cheekBoneWidth"
            values={data.cheekBoneWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('cheekBoneWidth', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="cheekBoneHeight" label="Height" max={1} />
          <Slider
            id="cheekBoneHeight"
            values={data.cheekBoneHeight}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('cheekBoneHeight', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Cheek" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="cheekWidth" label="Width" max={1} />
          <Slider
            id="cheekWidth"
            values={data.cheekWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('cheekWidth', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Eyes" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="eyeLids" label="Lids" max={1} />
          <Slider
            id="eyeLids"
            values={data.eyeLids}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('eyeLids', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Lips" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="lips" label="" max={1} />
          <Slider
            id="lips"
            values={data.lips}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('lips', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Jaw" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="jawWidth" label="Width" max={1} />
          <Slider
            id="jawWidth"
            values={data.jawWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('jawWidth', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="jawHeight" label="Height" max={1} />
          <Slider
            id="jawHeight"
            values={data.jawHeight}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('jawHeight', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Chin" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="chinLength" label="Length" max={1} />
          <Slider
            id="chinLength"
            values={data.chinLength}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('chinLength', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="chinPosition" label="Position" max={1} />
          <Slider
            id="chinPosition"
            values={data.chinPosition}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('chinPosition', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="chinWidth" label="Width" max={1} />
          <Slider
            id="chinWidth"
            values={data.chinWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('chinWidth', roundedFloat(values))}
          />
        </div>
        <div className="space-y-2">
          <SliderStats field="chinShape" label="Shape" max={1} />
          <Slider
            id="chinShape"
            values={data.chinShape}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('chinShape', roundedFloat(values))}
          />
        </div>
      </FieldSet>
      <FieldSet title="Neck" className="space-y-8">
        <div className="space-y-2">
          <SliderStats field="neckWidth" label="Width" max={1} />
          <Slider
            id="neckWidth"
            values={data.neckWidth}
            min={0}
            max={1}
            step={0.05}
            onDrag={(values) => onDrag('neckWidth', roundedFloat(values))}
          />
        </div>
      </FieldSet>
    </div>
  );
}
