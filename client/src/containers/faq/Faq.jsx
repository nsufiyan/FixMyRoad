import { FooterComponent } from "../../components/footer/Footer";
import "./faq.css";

export function FAQ() {
    const faqData = [
        {
            question: "How do I report a pothole?",
            answer:
                "You can report a pothole by navigating to the ' Complaint' page, filling out the required details, and submit your report. You can also attach a photo for better clarity."
        },
        {
            question: "Can I track my complaint?",
            answer:
                " Yes! You can track the status of your complaint by opening the submitted complaint, where you’ll be able to see whether it is marked as Pending, Resolved, or Rejected"
        },
        {
            question: "Is Fix My Road affiliated with the government?",
            answer:
                "No, Fix My Road is a community-driven platform and is not affiliated with any government agency."
        },
        {
            question: "Who can view my complaints?",
            answer:
                "Only you and the city admin can view your complaint details. Other users cannot access your reports."
        },
        {
            question: "How can I earn points?",
            answer:
                "Points are earned by submitting valid complaints and getting them resolved. Higher points help you rank on the leaderboard."
        },
        {
            question: "How long does it take for my complaint to be reviewed?",
            answer:
                "Response times may vary depending on the volume of complaints. However, our team typically reviews and updates the status of complaints within a reasonable timeframe. You can check whether your complaint is marked as Pending, Resolved, or Rejected by opening the submitted complaint."
        }
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* MAIN CONTENT */}
            <div className="flex-grow-1">
                <div className="container my-5">
                    <h2 className="text-center mb-4">
                        Frequently Asked Questions
                    </h2>

                    <div className="accordion" id="faqAccordion">
                        {faqData.map((item, index) => (
                            <div className="accordion-item" key={index}>
                                <h2
                                    className="accordion-header"
                                    id={`heading${index}`}
                                >
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse${index}`}
                                    >
                                        {item.question}
                                    </button>
                                </h2>

                                <div
                                    id={`collapse${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading${index}`}
                                    data-bs-parent="#faqAccordion"
                                >
                                    <div className="accordion-body">
                                        {item.answer}
                                    </div>
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
