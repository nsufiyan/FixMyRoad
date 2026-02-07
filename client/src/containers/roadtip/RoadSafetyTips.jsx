import { Shield, AlertTriangle, Car, Lightbulb, PhoneCall } from "lucide-react";
import "./RoadSafetyTips.css";
import { FooterComponent } from "../../components/footer/Footer";

export default function RoadSafetyTips() {
    const tips = [
        {
            icon: <Shield size={32} />,
            title: "Report Hazards Early",
            text: "If you spot potholes, broken signs, or cracked roads, report them immediately to reduce accidents.",
        },
        {
            icon: <AlertTriangle size={32} />,
            title: "Slow Down Near Damaged Roads",
            text: "Drive slowly near uneven surfaces or construction zones to avoid losing vehicle control.",
        },
        {
            icon: <Car size={32} />,
            title: "Maintain Safe Braking Distance",
            text: "Wet or broken roads increase braking distance. Keep extra space from the vehicle ahead.",
        },
        {
            icon: <Lightbulb size={32} />,
            title: "Use Headlights Wisely",
            text: "Turn on headlights during low visibility to help other drivers see you clearly.",
        },
        {
            icon: <PhoneCall size={32} />,
            title: "Keep Emergency Contacts",
            text: "Keep local municipal helplines, police, and towing contacts saved on your phone.",
        },
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* MAIN CONTENT */}
            <div className="flex-grow-1">
                <div className="container my-5">
                    <h3 className="text-center fw-bold mb-5">
                        🚦 Road Safety Tips
                    </h3>

                    <div className="timeline-zigzag">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className={`timeline-item ${index % 2 === 0 ? "left" : "right"
                                    }`}
                            >
                                <div className="timeline-content shadow-sm p-3 rounded">
                                    <div className="icon mb-2">
                                        {tip.icon}
                                    </div>
                                    <h5 className="fw-bold">{tip.title}</h5>
                                    <p className="text-muted mb-0">
                                        {tip.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <FooterComponent />
        </div>
    );
}
