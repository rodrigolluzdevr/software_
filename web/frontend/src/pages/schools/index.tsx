import SchoolsList from "@/components/schools";
import Wrapper from "@/components/wrapper/Wrapper"
import withAuth from "../utils/withAuth";

const Schools = () => {
  return (
    <Wrapper> 
      <div className="dashboardContainer">
        <SchoolsList/>
      </div>
    </Wrapper>
  );
};

export default withAuth(Schools, ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR']);
