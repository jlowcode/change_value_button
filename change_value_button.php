<?php

defined('_JEXEC') or die('Restricted access');

jimport('joomla.application.component.model');

require_once JPATH_SITE . '/components/com_fabrik/models/element.php';

class PlgFabrik_ElementChange_value_button extends PlgFabrik_Element {

    public function render($data, $repeatCounter = 0)
    {
        $input = $this->app->input;

        $displayData = new stdClass;
        $displayData->view = $input->get('view');
        $displayData->button = $this->getHTMLButton();

        $layout = $this->getLayout('details');

        return $layout->render($displayData);
    }

    public function elementJavascript($repeatCounter)
    {
        $id = $this->getHTMLId($repeatCounter);
        $formModel = $this->getFormModel();
        $params = $this->getParams();

        $opts = $this->getElementJSOptions($repeatCounter);
        $opts->rowId = $formModel->getRowId();
        $opts->formId = $formModel->getId();
        $opts->fieldValue = $params->get('cvb_value');
        $opts->table = $formModel->getTableName();
        $opts->elementName = $this->element->name;
        $opts->alertConfirm = $params->get('cvb_alert_confirm');
        $opts->alertSuccess = $params->get('cvb_alert_success');

        return array('FbChange_value_button', $id, $opts);
    }

    protected function getHTMLButton() {
        $params = $this->getParams();

        $label = $params->get('cvb_button_label');
        $style = $params->get('cvb_button_style');

        $button = "<button type='button' id='cvb_button' class='btn {$style} button'>{$label}</button>";

        return $button;
    }

    public function onChangeValue() {
        $rowId = $_POST['rowId'];
        $formId = $_POST['formId'];
        $table = $_POST['table'];
        $elementName = $_POST['elementName'];
        $fieldValue = $_POST['fieldValue'];

        $db = JFactory::getDbo();
        $update = array();
        $update['id'] = $rowId;
        $update[$elementName] = $fieldValue;
        $update = (Object) $update;
        $db->updateObject($table, $update, 'id');

        $formModel = JModelLegacy::getInstance('Form', 'FabrikFEModel');
        $formModel->setId($formId);
        $formModel->setRowId($rowId);
        $formModel->process();

        echo "Sucesso";
    }
}