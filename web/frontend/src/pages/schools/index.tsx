import SchoolsList from "@/components/schools";
import Wrapper from "@/components/wrapper/Wrapper"

const Schools = () => {
  return (
    <Wrapper> 
      <div className="dashboardContainer">
        <SchoolsList/>
      </div>
    </Wrapper>
  );
};

export default Schools;
