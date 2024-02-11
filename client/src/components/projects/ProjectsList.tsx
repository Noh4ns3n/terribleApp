import { ProjectT } from "../../types/DataTypes";
import useFetch from "../../api/useFetch";
import Project from "./Project";

const ProjectsList = () => {

    const {
        data, error, isPending
    } = useFetch<{projects: ProjectT[]}>(
        `http://localhost:3000/projects`
    )

    return isPending ? (
        <div className="loading">Loading ...</div>
      ) : (
        <div className="projects">
            My projects :
            {data?.projects.map((project) => (
                <div key={project.id} className="project">
                    <Project {...project}/>
                </div>
            ))}
        </div>
     );
}
 
export default ProjectsList;