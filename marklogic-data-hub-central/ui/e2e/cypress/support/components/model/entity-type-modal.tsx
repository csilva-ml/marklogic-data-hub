class EntityTypeModal {
  newEntityName(str: string) {
    cy.get("#entity-name").clear().type(str);
  }

  clearEntityName() {
    cy.get("#entity-name").focus().clear();
  }

  newEntityDescription(str: string) {
    cy.get("#description").type(str);
  }

  clearEntityDescription() {
    cy.get("#description").focus().clear();
  }

  entityNameError() {
    return cy.findByLabelText("entity-name-error");
  }
  getEntityDescription() {
    return cy.get("#description");
  }

  getCancelButton() {
    return cy.get("#entity-modal-cancel");
  }

  getAddButton() {
    return cy.get("#entity-modal-add", {timeout: 20000});
  }

}

const entityTypeModal = new EntityTypeModal();
export default entityTypeModal;
