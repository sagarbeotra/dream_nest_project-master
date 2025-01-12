import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
    return (
        <TypeAnimation
            sequence={[
                // Same substring at the start will only be typed once, initially
                "Your Home Away from Home",
                500,
                "Unique Stays, Unforgettable Memories",
                600,
            ]}
            speed={50}
            style={{
                fontSize: "40px",
                color: "white",
                display: "inline-block",
                textShadow: "1px 1px 20px #000",
            }}
            repeat={Infinity}
        />
    );
};

export default TypingAnim;
