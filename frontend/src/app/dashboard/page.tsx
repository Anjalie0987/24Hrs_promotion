import { Store, Megaphone, Target, BarChart3 } from "lucide-react";

export default function DashboardPage() {
    const cards = [
        { label: "Total Businesses", value: "0", detail: "Active now", icon: Store, color: "text-brand-primary" },
        { label: "Active Promotions", value: "0", detail: "Across all businesses", icon: Megaphone, color: "text-success" },
        { label: "Banner Impressions", value: "0", detail: "Last 24 hours", icon: Target, color: "text-brand-accent" },
        { label: "Click-through Rate", value: "0.0%", detail: "Average performance", icon: BarChart3, color: "text-error" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back!</h1>
                <p className="text-text-secondary">Here's an overview of your promotion status.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="card-saas hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{card.label}</p>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground">{card.value}</span>
                        </div>
                        <p className="mt-1 text-xs text-text-muted">{card.detail}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="card-saas min-h-[400px] flex flex-col items-center justify-center text-center border-dashed border-2 bg-transparent">
                <div className="max-w-md">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone className="h-8 w-8 text-brand-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No active promotions</h2>
                    <p className="text-text-secondary mb-6">
                        Start by adding a business and creating a new promotion to see your analytics here.
                    </p>
                    <button className="px-6 py-2.5 rounded-lg btn-gradient font-semibold shadow-md inline-flex items-center gap-2">
                        Create First Promotion
                    </button>
                </div>
            </div>
        </div>
    );
}
