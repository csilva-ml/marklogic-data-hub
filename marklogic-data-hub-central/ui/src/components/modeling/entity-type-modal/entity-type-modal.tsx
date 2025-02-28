import React, {useContext, useEffect, useState, useRef, useCallback} from "react";
import {Form, Icon, Input, Modal} from "antd";
import styles from "./entity-type-modal.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../../../util/user-context";
import {ModelingTooltips, ErrorTooltips} from "../../../config/tooltips.config";
import {createEntityType, updateModelInfo} from "../../../api/modeling";
import {MLTooltip} from "@marklogic/design-system";
import {TwitterPicker} from "react-color";
import graphConfig from "../../../config/graph-vis.config";
import {defaultHubCentralConfig} from "../../../config/modeling.config";


type Props = {
  isVisible: boolean;
  isEditModal: boolean;
  name: string;
  description: string;
  namespace: string;
  prefix: string;
  color: string;
  toggleModal: (isVisible: boolean) => void;
  updateEntityTypesAndHideModal: (entityName: string, description: string) => void;
  updateHubCentralConfig: (hubCentralConfig: any) => void;
};

const EntityTypeModal: React.FC<Props> = (props) => {
  const {handleError} = useContext(UserContext);
  const NAME_REGEX = new RegExp("^[A-Za-z][A-Za-z0-9_-]*$");
  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [, toggleIsNameDisabled] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionTouched, setisDescriptionTouched] = useState(false);
  const [namespace, setNamespace] = useState("");
  const [namespaceTouched, setisNamespaceTouched] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [prefixTouched, setisPrefixTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Uncategorized errors from backend
  const [loading, toggleLoading] = useState(false);
  const [colorSelected, setColorSelected] = useState("#EEEFF1");
  const [colorTouched, setisColorTouched] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [eventValid, setEventValid] = useState(false);
  const node: any = useRef();

  useEffect(() => {
    if (props.isVisible) {
      if (props.isEditModal) {
        setName(props.name);
        setDescription(props.description);
        setNamespace(props.namespace);
        setPrefix(props.prefix);
        setColorSelected(props.color);
      } else {
        // Add Modal
        setName("");
        setDescription("");
        setNamespace("");
        setPrefix("");
        setColorSelected("#EEEFF1");
      }
      setErrorName("");
      setErrorMessage("");
      toggleIsNameDisabled(true);
      toggleLoading(false);
    }
  }, [props.isVisible]);

  const handleChange = (event) => {
    if (event.target.id === "entity-name") {
      if (event.target.value === "") {
        toggleIsNameDisabled(true);
      } else {
        toggleIsNameDisabled(false);
        setErrorName("");
      }
      setName(event.target.value);
    }
    if (event.target.id === "description") {
      if (event.target.value !== props.description) {
        setisDescriptionTouched(true);
      } else {
        setisDescriptionTouched(false);
      }
      setDescription(event.target.value);
    }
    if (event.target.id === "namespace") {
      if (event.target.value !== props.namespace) {
        setisNamespaceTouched(true);
      } else {
        setisNamespaceTouched(false);
      }
      setNamespace(event.target.value);
    }
    if (event.target.id === "prefix") {
      if (event.target.value !== props.prefix) {
        setisPrefixTouched(true);
      } else {
        setisPrefixTouched(false);
      }
      setPrefix(event.target.value);
    }
  };

  const handleOuterClick = useCallback(
    e => {
      if (node.current && !node.current.contains(e.target)) {
      // Clicked outside the color picker menu
        setDisplayColorPicker(prev => false);
        setEventValid(prev => false);
      }
    }, []);

  useEffect(() => {
    if (eventValid) {
      document.addEventListener("click", handleOuterClick);
    }

    return () => {
      document.removeEventListener("click", handleOuterClick);
    };
  });

  const getErrorMessage = () => {
    if (errorMessage) {
      if (errorMessage.includes("valid absolute URI")) {
        return <span data-testid="namespace-error">Invalid syntax: Namespace property must be a valid absolute URI. Example: http://example.org/es/gs</span>;
      } else if (errorMessage.includes("prefix without specifying")) {
        return <span data-testid="namespace-error">You must define a namespace URI because you defined a prefix.</span>;
      } else if (errorMessage.includes("reserved pattern")) {
        return <span data-testid="prefix-error">You cannot use a reserved prefix. Examples: xml, xs, xsi</span>;
      } else if (errorMessage.includes("must specify a prefix")) {
        return <span data-testid="prefix-error">You must define a prefix because you defined a namespace URI.</span>;
      }
    }
    return errorMessage;
  };

  // Parse server error message to determine its type
  // TODO Server should categorize the error messages it returns so parsing is not needed
  const isErrorOfType = (type: string) => {
    let result = false;
    if (errorMessage) {
      if (errorMessage.includes("type already exists")) {
        result = type === "name";
      } else if (errorMessage.includes("valid absolute URI") || errorMessage.includes("prefix without specifying")) {
        result = type === "namespace";
      } else if (errorMessage.includes("reserved pattern") || errorMessage.includes("must specify a prefix")) {
        result = type === "namespacePrefix";
      }
    }
    return result;
  };

  const updateEntityDescription = async (name: string, description: string, namespace: string, prefix: string) => {
    try {
      const response = await updateModelInfo(name, description, namespace, prefix);
      if (response["status"] === 200) {
        props.updateEntityTypesAndHideModal(name, description);
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.hasOwnProperty("message")) {
          setErrorMessage(error["response"]["data"]["message"]);
        }
      } else {
        handleError(error);
      }
    }
  };

  const updateHubCentralConfig = async (entityName, color) => {
    let colorPayload = defaultHubCentralConfig;
    colorPayload.modeling.entities[entityName] = {color: color};
    props.updateHubCentralConfig(colorPayload);
  };

  const addNewEntityType = async (name: string, description: string) => {
    try {
      const payload = {
        name: name,
        description: description,
        namespace: namespace,
        namespacePrefix: prefix
      };
      const response = await createEntityType(payload);
      if (response["status"] === 201) {
        props.updateEntityTypesAndHideModal(name, description);
        await updateHubCentralConfig(name, colorSelected);
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.hasOwnProperty("message") && error.response.data["message"] === ErrorTooltips.entityErrorServerResp(name)) {
          setErrorMessage("name-error");
        } else {
          setErrorMessage(error["response"]["data"]["message"]);
        }
      } else {
        handleError(error);
      }
      toggleLoading(false);
    }
  };

  const entityPropertiesEdited = () => {
    return (descriptionTouched || namespaceTouched || prefixTouched);
  };

  const handleSubmit = async () => {
    try {
      if (entityPropertiesEdited()) {
        await updateEntityDescription(name, description, namespace, prefix);
      }
      if (colorTouched) {
        await updateHubCentralConfig(name, colorSelected);
      }
    } catch (error) {
      if (error.response.status === 400) {
        if (error.response.data.hasOwnProperty("message")) {
          setErrorMessage(error["response"]["data"]["message"]);
        }
      } else {
        handleError(error);
      }
    } finally {
      toggleLoading(false);
      if (props.isVisible) {
        props.toggleModal(false);
      }
    }
  };

  const onOk = (event) => {
    setErrorName("");
    setErrorMessage("");
    event.preventDefault();
    if (props.isEditModal) {
      toggleLoading(true);
      handleSubmit();
    } else {
      if (!NAME_REGEX.test(name)) {
        setErrorName(ModelingTooltips.nameRegex);
      } else {
        toggleLoading(true);
        addNewEntityType(name, description);
      }
    }
  };

  const onCancel = () => {
    props.toggleModal(false);
  };

  const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 18}
  };

  const handleEditColorMenu = () => {
    setEventValid(prev => true);
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorChange = async (color, event) => {
    if (color.hex !== props.color) {
      setisColorTouched(true);
    } else {
      setisColorTouched(false);
    }
    setColorSelected(color.hex);
  };

  return (
    <Modal
      className={styles.modal}
      visible={props.isVisible}
      closable={true}
      confirmLoading={loading}
      title={props.isEditModal ? "Edit Entity Type" : "Add Entity Type"}
      width="680px"
      cancelText="Cancel"
      cancelButtonProps={{id: "entity-modal-cancel"}}
      onCancel={() => onCancel()}
      okText={props.isEditModal ? "OK" : "Add"}
      onOk={onOk}
      okButtonProps={{id: "entity-modal-add", form: "entity-type-form", htmlType: "submit"}}
      maskClosable={false}
    >
      <Form
        {...layout}
        id="entity-type-form"
        onSubmit={onOk}
      >
        <Form.Item
          className={styles.formItem}
          {...formItemLayout}
          label={<span>
            Name:&nbsp;{props.isEditModal ? null : <span className={styles.asterisk}>*</span>}
            &nbsp;
          </span>}
          colon={false}
          labelAlign="left"
          validateStatus={(isErrorOfType("name") ? "error" : "")}
          help={errorName}
        >
          {props.isEditModal ? <span>{name}</span> : <Input
            id="entity-name"
            placeholder="Enter name"
            className={styles.input}
            value={name}
            onChange={handleChange}
            onBlur={handleChange}
          />}
          { errorMessage === "name-error" ? <p aria-label="entity-name-error" className={styles.errorServer}>An entity type is already using the name <strong>{name}</strong>. An entity type cannot use the same name as an existing entity type.</p>
            : errorMessage !== "" ? <p className={styles.errorServer}>{errorMessage}</p> : null}
          {props.isEditModal ? null : <MLTooltip title={ModelingTooltips.nameRegex}>
            <Icon type="question-circle" className={styles.icon} theme="filled" />
          </MLTooltip>}
        </Form.Item>
        <Form.Item
          label={<span className={styles.label}>Description:</span>}
          {...formItemLayout}
          labelAlign="left"
          className={styles.formItem}
          colon={false}
        >
          <Input
            id="description"
            placeholder="Enter description"
            className={styles.input}
            value={description}
            onChange={handleChange}
            onBlur={handleChange}
          />
          <MLTooltip title={ModelingTooltips.entityDescription}>
            <Icon type="question-circle" className={styles.icon} theme="filled" />
          </MLTooltip>
        </Form.Item>

        <Form.Item
          label="Namespace URI:"
          labelAlign="left"
          style={{marginLeft: 7, marginBottom: 0}}
          {...formItemLayout}
        >
          <Form.Item
            style={{display: "inline-block"}}
            validateStatus={isErrorOfType("namespace") ? "error" : ""}
            help={getErrorMessage()}
          >
            <Input
              id="namespace"
              placeholder="Example: http://example.org/es/gs"
              className={styles.input}
              value={namespace}
              onChange={handleChange}
              onBlur={handleChange}
              style={{width: "250px"}}
            />
          </Form.Item>
          <span className={styles.prefixLabel}>Prefix:</span>
          <Form.Item
            className={styles.formItem}
            colon={false}
            style={{display: "inline-block"}}
            validateStatus={isErrorOfType("namespacePrefix") ? "error" : ""}
            help={getErrorMessage()}
          >
            <Input
              id="prefix"
              placeholder="Example: esgs"
              className={styles.input}
              value={prefix}
              onChange={handleChange}
              onBlur={handleChange}
              style={{width: "120px"}}
            />
            <MLTooltip title={ModelingTooltips.namespace}>
              <Icon type="question-circle" className={styles.icon} theme="filled" />
            </MLTooltip>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Color:"
          labelAlign="left"
          style={{marginLeft: 7, marginBottom: 0}}
          {...formItemLayout}
        >
          <div className={styles.colorContainer}>
            <div data-testid={`${name}-color`} style={{width: "26px", height: "26px", background: colorSelected, marginTop: "4px"}}></div>
            <span className={styles.editIconContainer}><FontAwesomeIcon icon={faPencilAlt} size="sm" onClick={handleEditColorMenu} className={styles.editIcon} data-testid={"edit-color-icon"}/></span>
            <MLTooltip title={props.isEditModal ? <span>The selected color will be associated with the <b>{name}</b> entity type throughout your project</span> : <span>The selected color will be associated with this entity type throughout your project</span>} placement={"right"}>
              <Icon type="question-circle" className={styles.questionCircle} theme="filled"/>
            </MLTooltip>
          </div>
        </Form.Item>
      </Form>
      {displayColorPicker ? <div ref={node} id={"color-picker-menu"} className={styles.colorPickerContainer}><TwitterPicker colors={graphConfig.colorOptionsArray} color={colorSelected} onChangeComplete={handleColorChange}/></div> : null}
    </Modal>
  );
};

export default EntityTypeModal;
