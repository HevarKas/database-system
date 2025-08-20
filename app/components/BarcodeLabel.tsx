import Barcode from 'react-barcode';

type Props = {
  value: string;
};

export default function BarcodeLabel({ value }: Props) {
  return (
    <div className="flex flex-col items-center p-2">
      <Barcode
        value={value}
        format="EAN13"
        displayValue={true} // show numbers below
        height={60}
        width={2}
        margin={0}
      />
    </div>
  );
}
