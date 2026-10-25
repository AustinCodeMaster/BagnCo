import { Truck, Leaf, Headphones } from 'lucide-react';

const perks = [
  { Icon: Truck, label: 'Free shipping' },
  { Icon: Leaf, label: 'Quality materials' },
  { Icon: Headphones, label: 'Friendly support' },
];

export default function Perks() {
  return (
    <section className="perks" aria-label="The BAG & CO. promise">
      <div className="page-container perks-inner">
        {perks.map(({ Icon, label }) => <div className="perk" key={label}><Icon size={27} strokeWidth={1.5} aria-hidden="true" /><span>{label}</span></div>)}
      </div>
    </section>
  );
}
