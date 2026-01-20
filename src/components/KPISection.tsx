import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface KPICardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'warning' | 'success';
}

const KPICard = ({ value, label, icon, variant = 'default' }: KPICardProps) => {
  const variantStyles = {
    default: 'border-secondary/20',
    warning: 'border-destructive/30',
    success: 'border-secondary/40',
  };

  return (
    <div className={`bg-card rounded-3xl border ${variantStyles[variant]} p-6 text-center glow-pink`}>
      <div className="flex justify-center mb-3 text-secondary">
        {icon}
      </div>
      <p className="text-3xl md:text-4xl font-serif text-foreground mb-2">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
    </div>
  );
};

const KPISection = () => {
  // These would come from the database in the real implementation
  const kpis = {
    found: '4,247',
    active: '3,892',
    deactivated: '355',
  };

  return (
    <section className="px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard 
            value={kpis.found}
            label="Scammers Found"
            icon={<Shield size={28} />}
            variant="default"
          />
          <KPICard 
            value={kpis.active}
            label="Still Active"
            icon={<AlertTriangle size={28} />}
            variant="warning"
          />
          <KPICard 
            value={kpis.deactivated}
            label="Deactivated"
            icon={<CheckCircle size={28} />}
            variant="success"
          />
        </div>
      </div>
    </section>
  );
};

export default KPISection;
