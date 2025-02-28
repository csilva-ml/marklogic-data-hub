class PropertyTable {

  getAddPropertyButton(entityName: string) {
    return cy.findByLabelText(`${entityName}-add-property`, {timeout: 15000});
  }

  getProperty(propertyName: string) {
    return cy.findByTestId(`${propertyName}-span`);
  }

  getEntityInstanceCount(entityName: string) {
    return cy.findByTestId(`${entityName}-instance-count`).then(function(value) {
      return parseInt(value.text().replace(",", ""));
    });
  }

  getEntityLastProcessed(entityName: string) {
    return cy.findByTestId(`${entityName}-last-processed`);
  }

  getForeignIcon(propertyName: string) {
    return cy.findByTestId(`foreign-${propertyName}`);
  }

  getIdentifierIcon(propertyName: string) {
    return cy.findByTestId(`identifier-${propertyName}`);
  }

  getMultipleIcon(propertyName: string) {
    return cy.findByTestId(`multiple-icon-${propertyName}`);
  }

  getSortIcon(propertyName: string) {
    return cy.findByTestId(`sort-${propertyName}`);
  }

  getFacetIcon(propertyName: string) {
    return cy.findByTestId(`facet-${propertyName}`);
  }

  // getWildcardIcon(propertyName: string) {
  //   return cy.findByTestId(`wildcard-${propertyName}`);
  // }

  getPiiIcon(propertyName: string) {
    return cy.findByTestId(`pii-${propertyName}`);
  }

  getAddPropertyToStructureType(structureTypeName: string) {
    return cy.findAllByTestId(`add-struct-${structureTypeName}`).eq(0);
  }

  editProperty(propertyName: string) {
    cy.findByTestId(`${propertyName}-span`).scrollIntoView().then(() => {
      cy.findByTestId(`${propertyName}-span`).click({force: true});
    });
  }

  expandStructuredTypeIcon(propertyName: string) {
    return cy.findByTestId(`mltable-expand-${propertyName}`);
  }

  getDeletePropertyIcon(entityName: string, propertyName: string) {
    return cy.findByTestId(`delete-${entityName}-${propertyName}`).click({force: true});
  }

  getDeleteStructuredPropertyIcon(entityName: string, structuredTypeName: string, propertyName: string) {
    return cy.findAllByTestId(`delete-${entityName}-${structuredTypeName}-${propertyName}`).eq(0);
  }

  verifyRelationshipIcon(propertyName: string) {
    return cy.findByTestId(`relationship-${propertyName}`);
  }

  verifyForeignKeyIcon(propertyName: string) {
    return cy.findByTestId(`foreign-${propertyName}`);
  }
}

const propertyTable = new PropertyTable();
export default propertyTable;
