import axios from "axios";

const defaultEnv = {
  serviceName: "",
  dataHubVersion: "",
  markLogicVersion: ""
};

export function setEnvironment()  {
  axios.get("/api/environment/systemInfo")
    .then(res => {
      localStorage.setItem("serviceName", res.data.serviceName);
      localStorage.setItem("environment", JSON.stringify(res.data)) ;
    })
    .catch(err => {
      console.error(err);
    });
}

export function getEnvironment():any {
  let env: any;
  env = localStorage.getItem("environment");
  if (env) {
    return JSON.parse(env);
  } else {
    return defaultEnv;
  }
}

export function parseVersion(value):any {
  if (value === "") {
    return "";
  } else {
    let version = "";
    let flag = false;
    for (let c in value) {
      if (value[c] !== "." && value[c] !== "-") {
        version += value[c];
      } else if (value[c] === "." && flag === false) {
        flag = true;
        version += value[c];
      } else {
        break;
      }
    }
    return version;
  }
}

export function resetEnvironment() {
  localStorage.setItem("environment", JSON.stringify(defaultEnv));
}

export default {setEnvironment, getEnvironment, resetEnvironment};
