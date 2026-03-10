import React from "react";
import { Globe, FlaskConical, BrainCircuit, Shapes } from "lucide-react";

interface ProjectIconProps {
    type?: string;
}

const ProjectIcon: React.FC<ProjectIconProps> = ({ type }) => {
    const getColor = () => {
        switch (type?.toLowerCase()) {
            case "website":
                return "#3b82f6"; // Blue
            case "experiment":
                return "#10b981"; // Green
            case "other":
                return "#f59e0b"; // Amber
            case "ml":
            case "machine learning":
                return "#8b5cf6"; // Purple
            default:
                return "#6b7280"; // Gray
        }
    };

    const getIcon = () => {
        const color = getColor();
        const size = 20;
        switch (type?.toLowerCase()) {
            case "website":
                return <Globe size={size} color={color} />;
            case "experiment":
                return <FlaskConical size={size} color={color} />;
            case "other":
                return <Shapes size={size} color={color} />;
            case "ml":
            case "machine learning":
                return <BrainCircuit size={size} color={color} />;
            default:
                return null;
        }
    };

    return (
        <div className="project-icon-container" style={{ position: 'relative', display: 'inline-block' }}>
            {getIcon()}
            <span
                style={{
                    visibility: 'hidden',
                    backgroundColor: '#333',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    position: 'absolute',
                    zIndex: 1,
                    bottom: '125%',
                    left: '50%',
                    marginLeft: '-60px',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    width: '120px',
                    fontSize: '0.8rem',
                    pointerEvents: 'none'
                }}
                className="tooltip-text"
            >
                {type}
            </span>
            <style jsx>{`
        .project-icon-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
        </div>
    );
};

export default ProjectIcon;
