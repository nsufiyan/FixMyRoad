import { FooterComponent } from "../../components/footer/Footer";
import "./Guide.css";

export function Guide() {
    const steps = [
        {
            title: "1. Report the Pothole",
            desc: "The citizen captures a pothole and submits a report through the app.",
            img: "/guideTourImages/step1.jpg",
        },
        {
            title: "2. Submission Confirmation",
            desc: "The app confirms the submission and automatically marks the exact location on the map..",
            img: "/guideTourImages/step2.jpg",
        },
        {
            title: "3. Backend Tracking",
            desc: "The Admin Dashboard instantly receives the new report and shows it on the map for easy tracking",
            img: "/guideTourImages/step3.jpg",
        },
        {
            title: "4. Email Received",
            desc: "The citizen receives a confirmation email with all complaint details.",
            img: "/guideTourImages/step4.jpg",
        },
        {
            title: "5. Fixing the Pothole",
            desc: "An assigned crew is dispatched to inspect and repair the pothole.",
            img: "/guideTourImages/step5.jpg",
        },
        {
            title: "6. Updating Status",
            desc: "The complaint status is updated for full transparency, keeping the citizen informed throughout the process..",
            img: "/guideTourImages/step6.jpg",
        },
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* MAIN CONTENT */}
            <div className="flex-grow-1">
                <div className="container py-4">
                    <h3 className="text-center mb-4 fw-bold">
                        How the System Works
                    </h3>

                    <div className="timeline">
                        {steps.map((step, index) => (
                            <div className="timeline-item" key={index}>
                                <div className="timeline-icon"></div>

                                <div className="timeline-content">
                                    <h5>{step.title}</h5>
                                    <p>{step.desc}</p>
                                    <img
                                        src={step.img}
                                        className="img-fluid rounded mt-2"
                                        alt={`step-${index + 1}`}
                                    />
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
