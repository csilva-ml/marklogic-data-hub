import React, {CSSProperties, useContext, useState, useEffect} from "react";
import {AutoComplete, Dropdown, Icon, Menu} from "antd";
import styles from "./graph-view.module.scss";
import {ModelingTooltips} from "../../../config/tooltips.config";
import {MLTooltip, MLInput, MLButton, MLAlert} from "@marklogic/design-system";
import {DownOutlined} from "@ant-design/icons";
import PublishToDatabaseIcon from "../../../assets/publish-to-database-icon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExport} from "@fortawesome/free-solid-svg-icons";
import SplitPane from "react-split-pane";
import GraphViewSidePanel from "./side-panel/side-panel";
import {ModelingContext} from "../../../util/modeling-context";
import GraphVis from "./graph-vis/graph-vis";
import {ConfirmationType} from "../../../types/common-types";

type Props = {
  entityTypes: any;
  canReadEntityModel: any;
  canWriteEntityModel: any;
  deleteEntityType: (entityName: string) => void;
  updateSavedEntity: any;
  updateEntities: any;
  relationshipModalVisible: any;
  toggleRelationshipModal: any;
  toggleShowEntityModal: any;
  toggleIsEditModal: any;
  setEntityTypesFromServer: any;
  toggleConfirmModal: any;
  setConfirmType: any;
  hubCentralConfig: any;
  updateHubCentralConfig: (hubCentralConfig: any) => void;
};

const GraphView: React.FC<Props> = (props) => {

  const {modelingOptions, setSelectedEntity} = useContext(ModelingContext);
  const [filterMenuSuggestions, setFilterMenuSuggestions] = useState(["a"]);
  const [entityFiltered, setEntityFiltered] = useState("");
  const [isEntityFiltered, setIsEntityFiltered] = useState(false);
  const [graphEditMode, setGraphEditMode] = useState(false);
  const [coordsChanged, setCoordsChanged] = useState(false);
  const [splitPaneResized, setSplitPaneResized] = useState(false);
  const [exportPngButtonClicked, setExportPngButtonClicked] = useState(false);

  useEffect(() => {
    if (coordsChanged) {
      //props.setEntityTypesFromServer();
      setCoordsChanged(false);
    }
  }, [coordsChanged]);

  const publishIconStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    fill: "currentColor"
  };

  const handleFocus = () => {
    setFilterMenuSuggestions([]);
  };

  const handleTypeaheadChange = (value: any) => {
    setEntityFiltered(value);
    setIsEntityFiltered(false);
    if (value.length > 2) {
      Object.keys(props.entityTypes).map((key) => {
        let obj=filterMenuSuggestions;
        if (value && !filterMenuSuggestions.includes(props.entityTypes[key]["entityName"]) && props.entityTypes[key]["entityName"].toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          obj.push(props.entityTypes[key]["entityName"]);
        }
        setFilterMenuSuggestions(obj);
      });
    } else {
      setFilterMenuSuggestions([]);
    }
  };

  const handleFilterSelect = (value : any) => {
    setFilterMenuSuggestions([]);
    setIsEntityFiltered(true);
    setSelectedEntity(value);
  };


  const filter = <AutoComplete
    className={styles.filterInput}
    dataSource={filterMenuSuggestions}
    value={entityFiltered}
    onFocus= {handleFocus}
    onChange={handleTypeaheadChange}
    onSelect={handleFilterSelect}
    aria-label="graph-view-filter-autoComplete"
    placeholder={"Filter"}
  >
    <MLInput aria-label="graph-view-filter-input" suffix={<Icon className={styles.searchIcon} type="search" theme="outlined" />} size="small"></MLInput>
  </AutoComplete>;

  const handleAddMenu = (event) => {
    if (event.key === "addNewEntityType") {
      props.toggleShowEntityModal(true);
      props.toggleIsEditModal(false);
    } else if (event.key === "addNewRelationship") {
      // TODO open Add Relationship dialog
      // console.log("addNewRelationship", event);
    }
  };

  const addMenu = (
    <Menu onClick={handleAddMenu}>
      <Menu.Item key="addNewEntityType">
        <span aria-label={"add-entity-type"}>Add new entity type</span>
      </Menu.Item>
      <Menu.Item key="addNewRelationship" onClick={() => setGraphEditMode(true)}>
        <span aria-label={"add-relationship"}>Add new relationship</span>
      </Menu.Item>
    </Menu>
  );

  const addButton = (
    <Dropdown
      overlay={addMenu}
      trigger={["click"]}
      overlayClassName={styles.stepMenu}
      placement="bottomRight"
      disabled={!props.canWriteEntityModel}
    >
      <div className={styles.addButtonContainer}>
        <MLButton
          aria-label="add-entity-type-relationship"
          size="small"
          type="primary"
          disabled={!props.canWriteEntityModel}
          className={!props.canWriteEntityModel && styles.disabledPointerEvents}>
          <span className={styles.addButtonText}>Add</span>
          <DownOutlined className={styles.downArrowIcon} />
        </MLButton>
      </div>
    </Dropdown>
  );

  const publishButton = <MLButton
    className={!modelingOptions.isModified ? styles.disabledPointerEvents : ""}
    disabled={!modelingOptions.isModified}
    aria-label="publish-to-database"
    size="small" type="secondary"
    onClick={() => {
      props.setConfirmType(ConfirmationType.PublishAll);
      props.toggleConfirmModal(true);
    }}>
    <span className={styles.publishButtonContainer}>
      <PublishToDatabaseIcon style={publishIconStyle} />
      <span className={styles.publishButtonText}>Publish</span>
    </span>
  </MLButton>;

  const headerButtons = <span className={styles.buttons}>
    {graphEditMode ?
      <div className={styles.editModeInfoContainer}>
        <MLAlert
          type="info" aria-label="graph-edit-mode-info" showIcon
          message={ModelingTooltips.editModeInfo}/>
      </div> : ""
    }
    <span>
      {props.canWriteEntityModel ?
        <span>
          {addButton}
        </span>
        :
        <MLTooltip
          title={ModelingTooltips.addNewEntityGraph + " " + ModelingTooltips.noWriteAccess}
          placement="top" overlayStyle={{maxWidth: "175px"}}>
          <span className={styles.disabledCursor}>{addButton}</span>
        </MLTooltip>
      }
    </span>
    <MLTooltip title={ModelingTooltips.publish}>
      <span className={styles.disabledCursor}>{publishButton}</span>
    </MLTooltip>
    <MLTooltip title={ModelingTooltips.exportGraph} placement="topLeft">
      <FontAwesomeIcon className={styles.graphExportIcon} icon={faFileExport} aria-label="graph-export" onClick={() => { setExportPngButtonClicked(true); }}/>
    </MLTooltip>
  </span>;

  const splitPaneStyles = {
    pane1: {minWidth: "150px"},
    pane2: {minWidth: "140px", maxWidth: "90%"},
    pane: {overflow: "auto"},
  };

  const splitStyle: CSSProperties = {
    position: "relative",
    height: "none",
  };

  const handleEntitySelection = (entityName) => {
    setSelectedEntity(entityName);
  };

  const onCloseSidePanel = async () => {
    //closeSidePanelInGraphView();
    setSelectedEntity(undefined);
  };

  const deleteEntityClicked = (selectedEntity) => {
    props.deleteEntityType(selectedEntity);
  };

  const colorExistsForEntity = (entityName) => {
    return (!props.hubCentralConfig?.modeling?.entities[entityName]?.color ? false : true);
  };

  const getColor = (entityName) => {
    let color = "#EEEFF1";
    if (colorExistsForEntity(entityName) && filterMenuSuggestions.length > 0 && !filterMenuSuggestions.includes("a")) {
      if (filterMenuSuggestions && filterMenuSuggestions.includes(entityName)) {
        color = props.hubCentralConfig.modeling.entities[entityName]["color"];
      } else {
        color = "#F5F5F5";
      }
    } else if (colorExistsForEntity(entityName)) {
      color = props.hubCentralConfig.modeling.entities[entityName]["color"];
    } else {
      color = "#EEEFF1";
    }
    return color;
  };

  const graphViewMainPanel =
    <div className={styles.graphViewContainer}>
      <div className={styles.graphHeader}>
        {filter}
        {headerButtons}
      </div>
      <div>
        <GraphVis
          entityTypes={props.entityTypes}
          handleEntitySelection={handleEntitySelection}
          filteredEntityTypes={filterMenuSuggestions}
          entitySelected={entityFiltered}
          isEntitySelected={isEntityFiltered}
          updateSavedEntity={props.updateSavedEntity}
          toggleRelationshipModal={props.toggleRelationshipModal}
          relationshipModalVisible={props.relationshipModalVisible}
          canReadEntityModel={props.canReadEntityModel}
          canWriteEntityModel={props.canWriteEntityModel}
          graphEditMode={graphEditMode}
          setGraphEditMode={setGraphEditMode}
          setCoordsChanged={setCoordsChanged}
          hubCentralConfig={props.hubCentralConfig}
          updateHubCentralConfig={props.updateHubCentralConfig}
          getColor={getColor}
          splitPaneResized={splitPaneResized}
          setSplitPaneResized={setSplitPaneResized}
          exportPngButtonClicked = {exportPngButtonClicked}
          setExportPngButtonClicked = {setExportPngButtonClicked}
        />
      </div>
    </div>;

  const handleSplitPaneResize = () => {
    setSplitPaneResized(true);
  };

  return (
    !modelingOptions.selectedEntity ? graphViewMainPanel :
      <SplitPane
        style={splitStyle}
        paneStyle={splitPaneStyles.pane}
        allowResize={true}
        resizerClassName={styles.resizerStyle}
        pane1Style={splitPaneStyles.pane1}
        pane2Style={splitPaneStyles.pane2}
        split="vertical"
        primary="first"
        defaultSize="66%"
        onDragFinished={handleSplitPaneResize}
      >
        {graphViewMainPanel}
        <div>
          <GraphViewSidePanel
            entityTypes={props.entityTypes}
            onCloseSidePanel={onCloseSidePanel}
            deleteEntityClicked={deleteEntityClicked}
            canReadEntityModel={props.canReadEntityModel}
            canWriteEntityModel={props.canWriteEntityModel}
            updateEntities={props.updateEntities}
            updateSavedEntity={props.updateSavedEntity}
            hubCentralConfig={props.hubCentralConfig}
            updateHubCentralConfig={props.updateHubCentralConfig}
            getColor={getColor}
          />
        </div>
      </SplitPane>
  );
};

export default GraphView;
