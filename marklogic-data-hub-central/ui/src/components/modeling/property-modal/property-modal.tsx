import React, {useContext, useEffect, useState} from "react";
import {Cascader, Form, Icon, Input, Modal, Radio, Select} from "antd";
import {MLAlert, MLButton, MLCheckbox, MLTooltip} from "@marklogic/design-system";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./property-modal.module.scss";

import StructuredTypeModal from "../structured-type-modal/structured-type-modal";
import ConfirmationModal from "../../confirmation-modal/confirmation-modal";
import {UserContext} from "../../../util/user-context";
import {ModelingContext} from "../../../util/modeling-context";
import {entityReferences, primaryEntityTypes} from "../../../api/modeling";
import {ModelingTooltips} from "../../../config/tooltips.config";
import {getSystemInfo} from "../../../api/environment";

import {EditPropertyOptions, PropertyOptions, PropertyType, StructuredTypeOptions} from "../../../types/modeling-types";
import {ConfirmationType} from "../../../types/common-types";

import {
  COMMON_PROPERTY_TYPES,
  DROPDOWN_PLACEHOLDER,
  MORE_DATE_TYPES,
  MORE_NUMBER_TYPES,
  MORE_STRING_TYPES
} from "../../../config/modeling.config";

const {Option} = Select;

type Props = {
  entityName: any;
  entityDefinitionsArray: any[];
  isVisible: boolean;
  editPropertyOptions: EditPropertyOptions;
  structuredTypeOptions: StructuredTypeOptions;
  toggleModal: (isVisible: boolean) => void;
  addPropertyToDefinition: (definitionName: string, propertyName: string, propertyOptions: PropertyOptions) => void;
  addStructuredTypeToDefinition: (structuredTypeName: string, namespace: string|undefined, prefix: string|undefined, errorHandler: Function|undefined) => void;
  editPropertyUpdateDefinition: (definitionName: string, propertyName: string, editPropertyOptions: EditPropertyOptions) => void;
  deletePropertyFromDefinition: (definitionName: string, propertyName: string) => void;
};

const ALL_RADIO_DISPLAY_VALUES = [
  {
    label: "Identifier",
    value: "identifier",
    tooltip: ModelingTooltips.identifier
  },
  {
    label: "Allow Multiple Values",
    value: "multiple",
    tooltip: ModelingTooltips.multiple
  },
  {
    label: "PII",
    value: "pii",
    tooltip: ModelingTooltips.pii
  }
];

const ALL_CHECKBOX_DISPLAY_VALUES = [
  {
    label: "Sort",
    value: "sortable",
    tooltip: ModelingTooltips.sort
  },
  {
    label: "Facet",
    value: "facetable",
    tooltip: ModelingTooltips.facet
  },
  // {
  //   label: 'Wildcard Search',
  //   value: 'wildcard',
  //   tooltip: ModelingTooltips.wildcard
  // }
];

const DEFAULT_STRUCTURED_DROPDOWN_OPTIONS = {
  label: "Structured",
  value: "structured",
  children: [
    {
      label: "New Property Type",
      value: "newPropertyType"
    }
  ]
};

const DEFAULT_DROPDOWN_OPTIONS = [
  ...COMMON_PROPERTY_TYPES,
  DROPDOWN_PLACEHOLDER("1"),
  DEFAULT_STRUCTURED_DROPDOWN_OPTIONS,
  DROPDOWN_PLACEHOLDER("2"),
  MORE_STRING_TYPES,
  MORE_NUMBER_TYPES,
  MORE_DATE_TYPES
];

const DEFAULT_SELECTED_PROPERTY_OPTIONS: PropertyOptions = {
  propertyType: PropertyType.Basic,
  type: "",
  joinPropertyName: "",
  joinPropertyType: "",
  identifier: "no",
  multiple: "no",
  pii: "no",
  facetable: false,
  sortable: false
  //wildcard: false
};

const NAME_REGEX = new RegExp("^[A-Za-z][A-Za-z0-9_-]*$");

const layout = {
  labelCol: {span: 7},
  wrapperCol: {span: 17},
};

const PropertyModal: React.FC<Props> = (props) => {
  const {handleError} = useContext(UserContext);
  const {modelingOptions, setEntityPropertiesNamesArray} = useContext(ModelingContext);

  const [modalTitle, setModalTitle] = useState("");
  const [name, setName] = useState("");
  const [isNameDisabled, toggleIsNameDisabled] = useState(true); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  const [structuredTypeLabel, setStructuredTypeLabel] = useState("");
  const [showStructuredTypeModal, toggleStructuredTypeModal] = useState(false);

  const [confirmType, setConfirmType] = useState<ConfirmationType>(ConfirmationType.Identifer);
  const [showConfirmModal, toggleConfirmModal] = useState(false);
  const [confirmBoldTextArray, setConfirmBoldTextArray] = useState<string[]>([]);
  const [stepValuesArray, setStepValuesArray] = useState<string[]>([]);
  const [showSteps, toggleSteps] = useState(false);

  const [typeDisplayValue, setTypeDisplayValue] = useState<string[]>([]);
  const [typeErrorMessage, setTypeErrorMessage] = useState("");

  const [showJoinProperty, toggleShowJoinProperty] = useState(false);
  const [joinDisplayValue, setJoinDisplayValue] = useState<string | undefined>(undefined);
  const [joinProperties, setJoinProperties] = useState<any[]>([]);

  const [dropdownOptions, setDropdownOptions] = useState<any[]>(DEFAULT_DROPDOWN_OPTIONS);
  const [radioValues, setRadioValues] = useState<any[]>([]);
  const [showConfigurationOptions, toggleShowConfigurationOptions] = useState(false);

  const [selectedPropertyOptions, setSelectedPropertyOptions] = useState(DEFAULT_SELECTED_PROPERTY_OPTIONS);
  const [entityPropertyNamesArray, setEntityPropertyNamesArray] = useState<string[]>([]);

  useEffect(() => {
    if (props.isVisible) {
      setEntityPropertiesNamesArray(props.entityDefinitionsArray);
      updateTypeDropdown();
      if (props.editPropertyOptions.isEdit) {
        let structuredLabel = "";
        let typeDisplayValue = [props.editPropertyOptions.propertyOptions.type];
        let joinDisplayValue = "";
        let isCommonType = COMMON_PROPERTY_TYPES.some(property => property.value === props.editPropertyOptions.propertyOptions.type);
        let showConfigOptions = true;
        let showJoinProp = false;
        let newRadioValues = ALL_RADIO_DISPLAY_VALUES;
        getEntityReferences();

        if (!isCommonType && props.editPropertyOptions.propertyOptions.propertyType === PropertyType.Basic) {
          let type = "";
          let isMoreStringType = MORE_STRING_TYPES.children.some(property => property.value === props.editPropertyOptions.propertyOptions.type);
          let isMoreNumberType = MORE_NUMBER_TYPES.children.some(property => property.value === props.editPropertyOptions.propertyOptions.type);
          let isMoreDateType = MORE_DATE_TYPES.children.some(property => property.value === props.editPropertyOptions.propertyOptions.type);

          if (isMoreStringType) {
            type = "moreStringTypes";
          } else if (isMoreNumberType) {
            type = "moreNumberTypes";
          } else if (isMoreDateType) {
            type = "moreDateTypes";
          }

          typeDisplayValue = [type, props.editPropertyOptions.propertyOptions.type];

        } else if (props.editPropertyOptions.propertyOptions.propertyType === PropertyType.RelatedEntity) {
          joinDisplayValue = props.editPropertyOptions.propertyOptions.joinPropertyName;
          typeDisplayValue = ["relatedEntity", props.editPropertyOptions.propertyOptions.joinPropertyType];
          createJoinMenu(props.editPropertyOptions.propertyOptions.joinPropertyType, props.editPropertyOptions.propertyOptions.joinPropertyName);
          showJoinProp = true;
          showConfigOptions = false;
          newRadioValues = [ALL_RADIO_DISPLAY_VALUES[1]];
          structuredLabel = props.structuredTypeOptions.name;

        } else if (props.structuredTypeOptions.isStructured) {
          structuredLabel = props.structuredTypeOptions.name;
          newRadioValues = ALL_RADIO_DISPLAY_VALUES.slice(1, 3);
          if (props.editPropertyOptions.propertyOptions.propertyType === PropertyType.Structured) {
            typeDisplayValue = ["structured", props.editPropertyOptions.propertyOptions.type];
          }
        }

        setModalTitle("Edit Property");
        setStructuredTypeLabel(structuredLabel);
        setName(props.editPropertyOptions.name);
        setErrorMessage("");
        setRadioValues(newRadioValues);
        toggleShowConfigurationOptions(showConfigOptions);
        toggleShowJoinProperty(showJoinProp);
        setTypeDisplayValue(typeDisplayValue);
        setJoinDisplayValue(joinDisplayValue === "" ? undefined : joinDisplayValue);
        setSelectedPropertyOptions(props.editPropertyOptions.propertyOptions);
      } else {
        let modalTitle = "Add Property";
        if (props.structuredTypeOptions.isStructured) {
          modalTitle = "Add Structured Type Property";
          setStructuredTypeLabel(props.structuredTypeOptions.name.split(",").slice(1).join("."));
        }

        setModalTitle(modalTitle);
        setName("");
        setErrorMessage("");
        setTypeDisplayValue([]);
        setJoinDisplayValue(undefined);
        setRadioValues([]);
        toggleShowConfigurationOptions(false);
        toggleShowJoinProperty(false);
        setSelectedPropertyOptions(DEFAULT_SELECTED_PROPERTY_OPTIONS);
      }
    }
  }, [props.isVisible]);

  const getEntityReferences = async () => {
    try {
      const response = await entityReferences(props.entityName);
      if (response["status"] === 200) {
        let newConfirmType = ConfirmationType.DeletePropertyWarn;
        let boldText = [name];

        if (response["data"]["stepNames"].length > 0) {
          newConfirmType = ConfirmationType.DeletePropertyStepWarn;
          boldText.push(props.entityName);
        }
        setConfirmBoldTextArray(boldText);
        setConfirmType(newConfirmType);
        setStepValuesArray(response["data"]["stepNames"]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const refreshSessionTime = async () => {
    try {
      await getSystemInfo();
    } catch (error) {
      handleError(error);
    }
  };

  const handleInputChange = (event) => {
    if (event.target.id === "property-name") {
      if (event.target.value === "") {
        toggleIsNameDisabled(true);
      } else {
        toggleIsNameDisabled(false);
        setErrorMessage("");
      }
      setName(event.target.value);
    }
  };

  const onPropertyTypeChange = (value, selectedOptions) => {
    if (value.length) {
      let newSelectedPropertyOptions = {...selectedPropertyOptions};
      let typeValue = "";

      switch (value[0]) {
      case "relatedEntity":
        newSelectedPropertyOptions.propertyType = PropertyType.RelatedEntity;
        newSelectedPropertyOptions.joinPropertyName = "";
        newSelectedPropertyOptions.joinPropertyType = "";
        newSelectedPropertyOptions.identifier = "";
        newSelectedPropertyOptions.pii = "";
        typeValue = value[1];
        //newSelectedPropertyOptions.wildcard = false;

        toggleShowJoinProperty(true);
        setRadioValues([ALL_RADIO_DISPLAY_VALUES[1]]);
        toggleShowConfigurationOptions(false);
        createJoinMenu(value[1], "");
        break;
      case "structured":
        newSelectedPropertyOptions.propertyType = PropertyType.Structured;
        newSelectedPropertyOptions.identifier = "";
        toggleShowJoinProperty(false);
        //newSelectedPropertyOptions.wildcard = false;
        if (value[1] === "newPropertyType") {
          toggleStructuredTypeModal(true);
        } else {
          typeValue = value[1];
          setRadioValues(ALL_RADIO_DISPLAY_VALUES.slice(1, 3));
          toggleShowConfigurationOptions(true);
        }
        break;
      case "moreStringTypes":
      case "moreNumberTypes":
      case "moreDateTypes" :
        newSelectedPropertyOptions.propertyType = PropertyType.Basic;
        typeValue = value[1];
        if (props.structuredTypeOptions.isStructured && props.editPropertyOptions.name !== props.structuredTypeOptions.propertyName) {
          setRadioValues(ALL_RADIO_DISPLAY_VALUES.slice(1, 3));
        } else {
          setRadioValues(ALL_RADIO_DISPLAY_VALUES);
        }
        toggleShowJoinProperty(false);
        toggleShowConfigurationOptions(true);
        break;
      default:
        newSelectedPropertyOptions.propertyType = PropertyType.Basic;
        typeValue = value[0];
        if (props.structuredTypeOptions.isStructured && props.editPropertyOptions.name !== props.structuredTypeOptions.propertyName) {
          setRadioValues(ALL_RADIO_DISPLAY_VALUES.slice(1, 3));
        } else {
          setRadioValues(ALL_RADIO_DISPLAY_VALUES);
        }
        toggleShowJoinProperty(false);
        toggleShowConfigurationOptions(true);
        break;
      }

      setTypeDisplayValue(value);
      setSelectedPropertyOptions({...newSelectedPropertyOptions, type: typeValue});

    } else {
      setTypeDisplayValue([]);
      toggleShowJoinProperty(false);
      setRadioValues([]);
      toggleShowConfigurationOptions(false);
      setSelectedPropertyOptions({...selectedPropertyOptions, type: "", propertyType: PropertyType.Basic});
    }
    setTypeErrorMessage("");
    setJoinDisplayValue(undefined);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!NAME_REGEX.test(name)) {
      setErrorMessage(ModelingTooltips.nameRegex);
    } else {
      if (props.editPropertyOptions.isEdit) {
        let editEntityPropertyNamesArray = entityPropertyNamesArray.filter(propertyName => propertyName !== props.editPropertyOptions.name);

        if (editEntityPropertyNamesArray.includes(name)) {
          setErrorMessage("name-error");
        } else if (selectedPropertyOptions.type === "") {
          setTypeErrorMessage("Type is required");
        } else {

          let definitionName = props.entityName;
          let typeChangeCheck = props.editPropertyOptions.propertyOptions.propertyType;

          if (props.structuredTypeOptions.isStructured && props.structuredTypeOptions.name !== props.editPropertyOptions.propertyOptions.propertyType) {
            definitionName = props.structuredTypeOptions.name;
          }
          if (props.structuredTypeOptions.isStructured && props.structuredTypeOptions.name === props.editPropertyOptions.propertyOptions.type) {
            definitionName = props.entityName;
          }
          if (typeChangeCheck === PropertyType.Structured && typeChangeCheck !== selectedPropertyOptions.propertyType) {
            definitionName = props.entityName;
          }

          // Ensure correct types for related case
          if (selectedPropertyOptions.propertyType === "relatedEntity") {
            selectedPropertyOptions.type = typeDisplayValue[1];
            selectedPropertyOptions.joinPropertyType = joinProperties.find(prop => prop.value === selectedPropertyOptions.joinPropertyName) ? joinProperties.find(prop => prop.value === selectedPropertyOptions.joinPropertyName).type : "string";
          }

          const newEditPropertyOptions: EditPropertyOptions = {
            name: name,
            isEdit: true,
            propertyOptions: selectedPropertyOptions
          };

          props.editPropertyUpdateDefinition(definitionName, props.editPropertyOptions.name, newEditPropertyOptions);
          setErrorMessage("");
          setTypeErrorMessage("");
          props.toggleModal(false);
          refreshSessionTime();
        }

      } else {
        // Add Property
        if (entityPropertyNamesArray.includes(name)) {
          setErrorMessage("name-error");
        } else if (selectedPropertyOptions.type === "") {
          setTypeErrorMessage("Type is required");
        } else {
          let definitionName = props.structuredTypeOptions.isStructured ? props.structuredTypeOptions.name : props.entityName;
          props.addPropertyToDefinition(definitionName, name, selectedPropertyOptions);
          setErrorMessage("");
          setTypeErrorMessage("");
          props.toggleModal(false);
          refreshSessionTime();
        }
      }
    }
  };


  const onCancel = () => {
    setRadioValues([]);
    toggleShowConfigurationOptions(false);
    setSelectedPropertyOptions(DEFAULT_SELECTED_PROPERTY_OPTIONS);
    props.toggleModal(false);
  };

  const confirmAction = () => {
    if (confirmType === ConfirmationType.Identifer) {
      setSelectedPropertyOptions({...selectedPropertyOptions, identifier: "yes"});
      setStepValuesArray([]);
      setConfirmBoldTextArray([]);
      toggleConfirmModal(false);
    } else {
      // Delete Property
      let definitionName = props.entityName;
      if (props.structuredTypeOptions.isStructured && props.editPropertyOptions.propertyOptions.type !== props.structuredTypeOptions.name) {
        definitionName = props.structuredTypeOptions.name;
      }

      props.deletePropertyFromDefinition(definitionName, name);
      setStepValuesArray([]);
      setConfirmBoldTextArray([]);
      toggleConfirmModal(false);
      props.toggleModal(false);
      refreshSessionTime();
    }
  };

  const addStructuredType = async (name: string, namespace: string|undefined, namespacePrefix: string|undefined, errorHandler: Function|undefined) => {
    let newStructuredDefinitionObject = {
      name,
      namespace,
      namespacePrefix,
      primaryKey: "",
      elementRangeIndex: [],
      pii: [],
      rangeIndex: [],
      required: [],
      wordLexicon: [],
      properties: []
    };

    let structuredDefinitions = props.entityDefinitionsArray.filter(entity => entity.name !== props.entityName);
    structuredDefinitions.push(newStructuredDefinitionObject);
    let structuredDropdown = createStructuredDropdown(structuredDefinitions);

    if (modelingOptions.entityTypeNamesArray.length > 1 && structuredDefinitions.length > 0) {
      let relatedEntityDropdown = createRelatedEntityDropdown();

      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        structuredDropdown,
        relatedEntityDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);
      setEntityPropertyNamesArray([...entityPropertyNamesArray, name]);

    } else if (modelingOptions.entityTypeNamesArray.length <= 1 && structuredDefinitions.length > 0) {
      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        structuredDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);
    }
    setTypeDisplayValue(["structured", name]);
    setSelectedPropertyOptions({...selectedPropertyOptions, type: name});
    setRadioValues(ALL_RADIO_DISPLAY_VALUES.slice(1, 3));
    toggleShowConfigurationOptions(false);

    await props.addStructuredTypeToDefinition(name, namespace, namespacePrefix, (error) => {
      if (errorHandler) {
        errorHandler(error);
      }
      updateTypeDropdown();
      setTypeDisplayValue(["structured", "newPropertyType"]);
      setSelectedPropertyOptions({...selectedPropertyOptions, propertyType: PropertyType.Structured, identifier: "", type: "newPropertyType"});
    });
  };

  const updateTypeDropdown = () => {
    let entityDefinition = props.entityDefinitionsArray.find(entity => entity.name === props.entityName);
    let structuredDefinitions = props.entityDefinitionsArray.filter(entity => entity.name !== props.entityName);
    let propertyNamesArray = entityDefinition["properties"].map(property => property.name);
    let entityNamesArray = props.entityDefinitionsArray.map(entity => entity.name);

    if (props.structuredTypeOptions.isStructured) {
      let splitName = props.structuredTypeOptions.name.split(",");
      let structuredTypeName = splitName[splitName.length-1];
      let structuredTypeDefinition = props.entityDefinitionsArray.find(entity => entity.name === structuredTypeName);
      if (structuredTypeDefinition && structuredTypeDefinition["properties"].length) {
        propertyNamesArray = structuredTypeDefinition["properties"].map(property => property.name);
      } else {
        propertyNamesArray = [];
      }
    }

    if (modelingOptions.entityTypeNamesArray.length <= 1 && structuredDefinitions.length === 0) {
      setDropdownOptions(DEFAULT_DROPDOWN_OPTIONS);

    } else if (modelingOptions.entityTypeNamesArray.length > 1 && structuredDefinitions.length === 0) {
      let relatedEntityDropdown = createRelatedEntityDropdown();

      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        DEFAULT_STRUCTURED_DROPDOWN_OPTIONS,
        relatedEntityDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);

    } else if (modelingOptions.entityTypeNamesArray.length <= 1 && structuredDefinitions.length > 0) {
      let structuredDropdown = createStructuredDropdown(structuredDefinitions);

      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        structuredDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);
    } else if (
      (
        props.editPropertyOptions.isEdit
        && (props.editPropertyOptions.propertyOptions.propertyType === PropertyType.Structured)
      )
      ||
      (
        (modelingOptions.entityTypeNamesArray.length > 1)
        && (structuredDefinitions.length > 0)
        && !props.structuredTypeOptions.isStructured
      )
    ) {
      let structuredDropdown = createStructuredDropdown(structuredDefinitions);
      let relatedEntityDropdown = createRelatedEntityDropdown();

      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        structuredDropdown,
        relatedEntityDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);

    } else if (props.structuredTypeOptions.isStructured) {
      let structuredDropdown = createStructuredDropdown(structuredDefinitions);
      let relatedEntityDropdown = createRelatedEntityDropdown();

      setDropdownOptions([
        ...COMMON_PROPERTY_TYPES,
        DROPDOWN_PLACEHOLDER("1"),
        structuredDropdown,
        relatedEntityDropdown,
        DROPDOWN_PLACEHOLDER("2"),
        MORE_STRING_TYPES,
        MORE_NUMBER_TYPES,
        MORE_DATE_TYPES
      ]);
    }
    setEntityPropertyNamesArray([...propertyNamesArray, ...entityNamesArray]);
  };

  const createRelatedEntityDropdown = () => {
    let entityTypes = modelingOptions.entityTypeNamesArray
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(entity => { return {label: entity.name, value: entity.name}; });

    return {
      label: "Related Entity",
      value: "relatedEntity",
      children: entityTypes
    };
  };

  const createStructuredDropdown = (structuredDefinitions) => {
    let structuredTypes = structuredDefinitions
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(definition => { return {label: definition.name, value: definition.name}; });

    return {
      ...DEFAULT_STRUCTURED_DROPDOWN_OPTIONS,
      children: [...DEFAULT_STRUCTURED_DROPDOWN_OPTIONS["children"], ...structuredTypes]
    };
  };

  const getJoinMenuProps = (model, modelUpdated) => {
    let alreadyAdded: string[] = [], result;
    // Check each property from saved model and build menu items
    if (model) {
      result = Object.keys(model.properties).map(key => {
        alreadyAdded.push(key);
        // Structured property case
        if (model.properties[key].hasOwnProperty("$ref")) {
          return {
            value: key,
            label: key,
            type: "", // TODO
            disabled: true,
            // TODO Support structure properties
            // children: getJoinProps(...)
          };
        } else if (model.properties[key]["datatype"] === "array") {
          // Array property case
          return {
            value: key,
            label: key,
            type: "", // TODO
            disabled: true
          };
        } else {
          // Default case
          return {
            value: key,
            label: key,
            type: model.properties[key].datatype
          };
        }
      });
    }
    // Include any new properties from updated model object
    if (modelUpdated) {
      Object.keys(modelUpdated?.properties).map(key => {
        if (!alreadyAdded.includes(key)) {
          result.push({
            value: key,
            label: key,
            type: modelUpdated.properties[key].datatype,
            disabled: true
          });
        }
      });
    }
    return result;
  };

  const createJoinMenu = async (entityName, entityProp) => {
    let entity, model, entityUpdated, modelUpdated, menuProps;
    try {
      const response = await primaryEntityTypes();
      // Saved model data
      if (response) {
        entity = response.data.find(ent => ent.entityName === entityName);
        model = entity.model.definitions[entityName];
      }
      entityUpdated = modelingOptions.modifiedEntitiesArray.find(ent => ent.entityName === entityName);
      // Modified model data (if present)
      if (entityUpdated) {
        modelUpdated = entityUpdated.modelDefinition[entityName];
      }
      menuProps = getJoinMenuProps(model, modelUpdated);
      menuProps.unshift({value: "None", label: "None", type: "string"});
      setJoinProperties(menuProps);
    } catch (error) {
      handleError(error);
    }
  };

  const onJoinPropertyChange = (value) => {
    setJoinDisplayValue(value);
    let joinPropertyVal = value === "None" ? "" : value;
    const type = value === "None" ? "" : joinProperties.find(prop => prop["value"] === value).type;
    setSelectedPropertyOptions({...selectedPropertyOptions, joinPropertyName: joinPropertyVal, joinPropertyType: type});
  };

  const onRadioChange = (event, radioName) => {
    if (radioName === "identifier" && event.target.value === "yes") {
      let entityDefinition = props.entityDefinitionsArray.find(entity => entity.name === props.entityName);
      let primaryKey = entityDefinition["primaryKey"];

      if (primaryKey) {
        setConfirmType(ConfirmationType.Identifer);
        setConfirmBoldTextArray([primaryKey, name]);
        setStepValuesArray([]);
        toggleConfirmModal(true);
      } else {
        setSelectedPropertyOptions({...selectedPropertyOptions, [radioName]: event.target.value});
      }

    } else {
      setSelectedPropertyOptions({...selectedPropertyOptions, [radioName]: event.target.value});
    }
  };

  const onCheckboxChange = (event, checkboxName) => {
    setSelectedPropertyOptions({...selectedPropertyOptions, [checkboxName]: event.target.checked});
  };

  const renderRadios = radioValues.length > 0 && radioValues.map((radio, index) => {
    return (
      <Form.Item
        key={index}
        label={radio.label}
        labelAlign="left"
        className={styles.formItem}
      >
        <Radio.Group
          onChange={(event) => onRadioChange(event, radio.value)}
          value={selectedPropertyOptions[radio.value]}
        >
          <Radio aria-label={radio.value + "-yes"} value={"yes"}>Yes</Radio>
          <Radio aria-label={radio.value + "-no"} value={"no"}>No</Radio>
        </Radio.Group>
        <MLTooltip title={radio.tooltip}>
          <Icon type="question-circle" className={styles.radioQuestionIcon} theme="filled" />
        </MLTooltip>
      </Form.Item>
    );
  });

  const renderCheckboxes = ALL_CHECKBOX_DISPLAY_VALUES.map((checkbox, index) => {
    return (
      <Form.Item
        key={index}
        className={styles.formItemCheckbox}
        label={" "}
        labelAlign="left"
        colon={false}
      >
        <MLCheckbox
          id={checkbox.value}
          checked={selectedPropertyOptions[checkbox.value]}
          onChange={(event) => onCheckboxChange(event, checkbox.value)}
        >{checkbox.label}</MLCheckbox>
        <MLTooltip title={checkbox.tooltip}>
          <Icon type="question-circle" className={styles.checkboxQuestionIcon} theme="filled" />
        </MLTooltip>
      </Form.Item>
    );
  });

  const renderSteps = stepValuesArray.map((step, index) => <li key={step + index}>{step}</li>);

  const modalFooter = <div className={props.editPropertyOptions.isEdit ? styles.editFooter : styles.addFooter}>
    { props.editPropertyOptions.isEdit &&
      <MLButton type="link" onClick={async () => {
        if (confirmType === ConfirmationType.Identifer) {
          await getEntityReferences();
        }
        toggleConfirmModal(true);
      }}>
        <FontAwesomeIcon data-testid={"delete-" + props.editPropertyOptions.name} className={styles.trashIcon} icon={faTrashAlt} />
      </MLButton>
    }
    <div>
      <MLButton
        aria-label="property-modal-cancel"
        size="default"
        onClick={onCancel}
      >Cancel</MLButton>
      <MLButton
        aria-label="property-modal-submit"
        form="property-form"
        type="primary"
        htmlType="submit"
        size="default"
        onClick={onSubmit}
      >{props.editPropertyOptions.isEdit ? "OK" : "Add"}</MLButton>
    </div>
  </div>;

  return (
    <Modal
      className={styles.modal}
      visible={props.isVisible}
      destroyOnClose={true}
      closable={true}
      title={modalTitle}
      maskClosable={false}
      width="680px"
      style={{top: 30}}
      onCancel={onCancel}
      footer={modalFooter}
    >
      {props.editPropertyOptions.isEdit && stepValuesArray.length > 0 &&
        <div className={styles.warningContainer}>
          <MLAlert
            className={styles.alert}
            closable={false}
            description={"Entity type is used in one or more steps."}
            showIcon
            type="warning"
          />
          <p className={styles.stepWarning}>
            The <b>{props.entityName}</b> entity type is in use in some steps. If that usage is affected by this property,
            you may need to modify these steps to correlate with your changes to this property.
          </p>
          <p
            aria-label="toggle-steps"
            className={styles.toggleSteps}
            onClick={() => toggleSteps(!showSteps)}
          >{showSteps ? "Hide Steps..." : "Show Steps..."}</p>

          {showSteps && (
            <ul className={styles.stepList}>
              {renderSteps}
            </ul>
          )}
        </div>
      }
      <Form
        {...layout}
        id="property-form"
        onSubmit={onSubmit}
      >
        <Form.Item
          className={styles.formItemEntityType}
          label={<span>Entity Type:</span>}
          colon={false}
          labelAlign="left"
        >
          <span>{props.entityName}</span>
        </Form.Item>

        { props.structuredTypeOptions.isStructured
          && selectedPropertyOptions.type !== props.structuredTypeOptions.name
          && props.editPropertyOptions.propertyOptions.type !== props.structuredTypeOptions.name && (
          <Form.Item
            className={styles.formItemEntityType}
            label={<span>Structured Type:</span>}
            colon={false}
            labelAlign="left"
          >
            <span id="structured-label">{structuredTypeLabel}</span>
          </Form.Item>
        )}

        <Form.Item
          className={styles.formItem}
          label={<span>
            Name:&nbsp;<span className={styles.asterisk}>*</span>
            &nbsp;
          </span>}
          colon={false}
          labelAlign="left"
          validateStatus={errorMessage ? "error" : ""}
          help={errorMessage === "name-error" ? ModelingTooltips.duplicatePropertyError(name) : errorMessage}
        >
          <Input
            id="property-name"
            aria-label="input-name"
            placeholder="Enter the property name"
            className={styles.input}
            value={name}
            onChange={handleInputChange}
            onBlur={handleInputChange}
          />
          <MLTooltip title={ModelingTooltips.nameEntityProperty}>
            <Icon type="question-circle" className={styles.icon} theme="filled" />
          </MLTooltip>
        </Form.Item>

        <Form.Item
          className={styles.formItem}
          label={<span>
            Type:&nbsp;<span className={styles.asterisk}>*</span>
            &nbsp;
          </span>}
          colon={false}
          labelAlign="left"
          wrapperCol={{span: 15}}
          validateStatus={typeErrorMessage ? "error" : ""}
          help={typeErrorMessage}
          id="type-container"
        >
          <Cascader
            aria-label="type-dropdown"
            placeholder="Select the property type"
            options={dropdownOptions}
            displayRender={ label => {
              if (label[label.length - 1]) {
                if (label[0] === "Related Entity") {
                  return "Relationship: " + label[label.length - 1];
                } else if (label[0] === "Structured") {
                  return "Structured: " + label[label.length - 1];
                } else {
                  return label[label.length - 1];
                }
              } else {
                return label[label.length - 1];
              }
            }}
            onChange={onPropertyTypeChange}
            value={typeDisplayValue}
          />
        </Form.Item>

        { showJoinProperty && (
          <div className={styles.joinPropertyContainer}>
            <span className={styles.joinPropertyText}>You can select the foreign key now or later:</span>
            <div className={styles.joinPropertyInput}>
              <Select
                placeholder="Select foreign key"
                onChange={onJoinPropertyChange}
                value={joinDisplayValue}
                aria-label="foreignKey-select"
                className={styles.joinPropertyDropdown}
              >
                {joinProperties.length > 0 && joinProperties.map((prop, index) => (
                  <Option key={`${prop.label}-option`} value={prop.value} disabled={prop.disabled} aria-label={`${prop.label}-option`}>{prop.label === "None" ? "- " + prop.label + " -" : prop.label}</Option>
                ))}
              </Select>
              <MLTooltip title={ModelingTooltips.foreignKeyInfo}>
                <Icon data-testid={"foreign-key-tooltip"} type="question-circle" className={styles.joinPropertyHelpIcon} theme="filled" />
              </MLTooltip>
            </div>
          </div>
        ) }

        {renderRadios}

        { showConfigurationOptions && (
          <>
            <h4>Configuration Options</h4>
            {renderCheckboxes}
          </>
        )
        }
      </Form>
      <StructuredTypeModal
        isVisible={showStructuredTypeModal}
        toggleModal={toggleStructuredTypeModal}
        entityDefinitionsArray={props.entityDefinitionsArray}
        updateStructuredTypesAndHideModal={addStructuredType}
      />
      <ConfirmationModal
        isVisible={showConfirmModal}
        type={confirmType}
        boldTextArray={confirmBoldTextArray}
        arrayValues={stepValuesArray}
        toggleModal={toggleConfirmModal}
        confirmAction={confirmAction}
      />
    </Modal>
  );
};

export default PropertyModal;
