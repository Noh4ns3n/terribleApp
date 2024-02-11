import { ProjectT } from "../../types/DataTypes";

const Project = ({
 name, description = undefined, type = undefined, url = undefined, language = undefined
} : ProjectT) => {
    return ( 
        <div className="project">
            <h2>{name} | {type} {language && <>{language}</>}</h2>
            <p>{description}</p>
            {url && <a>{url}</a>}
        </div>
     );
}
 
export default Project;