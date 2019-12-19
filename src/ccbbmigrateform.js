import { Form, Input, Button, Checkbox } from 'antd';
import ReactDOM from "react-dom";
import React ,{useState} from "react";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8, offset: 4 },
};
class DynamicRule extends React.Component {
  state = {
    checkNick: false,
    formdefaultvalue : {
      BACK_SYSCODE : 'Non-Loaded',
      BACK_SYSCODE_BBREPONAME : 'Non-Loaded',
      BACK_SYSCODE_MODULENAME : 'Non-Loaded',
      BACK_SYSCODE_SRC : 'Non-Loaded',
      CC_CHECKLISTFILE : 'Non-Loaded',
      CC_ROOT_SRC_PREFIX : 'Non-Loaded',
      TARGET_ROOT_PATH : 'Non-Loaded',
    },
    isCCBBMigrating : false 
  };

  check = () => {
    this.props.form.validateFields(err => {
      if (!err) {
        console.info('success');
      }
    });
  };

  handleChange = e => {
    this.setState(
      {
        checkNick: e.target.checked,
      },
      () => {
        this.props.form.validateFields(['nickname'], { force: true });
      },
    );
  };

  componentDidMount() {
    //alert('form component mounted');
    var curap = this ;
    return  fetch(
      "https://10.180.104.108/cctobb/html/queryInitprop.jsp"
    )
      .then(function(response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
      })
      .then(function(responsejson) {
        console.log(responsejson);
        //curap.setState({...responsejson });
        //console.log(curap.state)
        curap.props.form.setFieldsValue({...responsejson});
      })
      .then(function(){
          fetch(
            "https://10.180.104.108/cctobb/html/IsCCToBBInProcess.jsp"
          )
          .then(function(responseOfMiInProcess) {
            if (!responseOfMiInProcess.ok) {
              throw new Error("HTTP error, status = " + responseOfMiInProcess.status);
            }
            var returnjson = responseOfMiInProcess.json() ;
            console.log(returnjson);
            return returnjson;
          })
          .then(function(responsejson) {
            console.log(responsejson);
            curap.setState({isCCBBMigrating : responsejson.ISCCTOBB_LOCK});
          }) 
      } 
      )

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const handleformclick = this.props.handchkclick ;
    const ccprefix = 'abcde'
    return (
      <div>
        <Form.Item {...formItemLayout} label="CC_ROOT_SRC_PREFIX">
          {getFieldDecorator('CC_ROOT_SRC_PREFIX', {
            rules: [
              {
                required: true,
                message: 'Please input CC ROOT PREFIX',
              },
            ],
            initialValue  : this.state.formdefaultvalue['CC_ROOT_SRC_PREFIX']
          })(<Input placeholder="Please input your CC ROOT PREFIX"  />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="TARGET_ROOT_PATH">
          {getFieldDecorator('TARGET_ROOT_PATH', {
            rules: [
              {
                required: true,
                message: 'Please input your TARGET_ROOT_PATH',
              },
            ],
            initialValue  : this.state.formdefaultvalue['TARGET_ROOT_PATH']
          })(<Input placeholder="Please input your TARGET_ROOT_PATH" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="CC_CHECKLISTFILE">
          {getFieldDecorator('CC_CHECKLISTFILE', {
            rules: [
              {
                required: true,
                message: 'Please input your CC_CHECKLISTFILE',
              },
            ],
            initialValue  : this.state.formdefaultvalue['CC_CHECKLISTFILE']
          })(<Input placeholder="Please input your CC_CHECKLISTFILE" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="BACK_SYSCODE">
          {getFieldDecorator('BACK_SYSCODE', {
            rules: [
              {
                required: true,
                message: 'Please input your BACK_SYSCODE',
              },
            ],
            initialValue  : this.state.formdefaultvalue['BACK_SYSCODE']
          })(<Input placeholder="Please input your BACK_SYSCODE" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="BACK_SYSCODE_MODULENAME">
          {getFieldDecorator('BACK_SYSCODE_MODULENAME', {
            rules: [
              {
                required: true,
                message: 'Please input your BACK_SYSCODE_MODULENAME',
              },
            ],
            initialValue  : this.state.formdefaultvalue['BACK_SYSCODE_MODULENAME']
          })(<Input placeholder="Please input your BACK_SYSCODE_MODULENAME" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="BACK_SYSCODE_BBREPONAME">
          {getFieldDecorator('BACK_SYSCODE_BBREPONAME', {
            rules: [
              {
                required: true,
                message: 'Please input your BACK_SYSCODE_BBREPONAME',
              },
            ],
            initialValue  : this.state.formdefaultvalue['BACK_SYSCODE_BBREPONAME']
          })(<Input placeholder="Please input your BACK_SYSCODE_BBREPONAME" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="BACK_SYSCODE_SRC">
          {getFieldDecorator('BACK_SYSCODE_SRC', {
            rules: [
              {
                required: true,
                message: 'Please input your BACK_SYSCODE_SRC',
              },
            ],
            initialValue  : this.state.formdefaultvalue['BACK_SYSCODE_SRC']
          })(<Input placeholder="Please input your BACK_SYSCODE_SRC" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="BBPROPPATH">
          {getFieldDecorator('BBPROPPATH', {
            rules: [
              {
                required: true,
                message: 'Please input your BBPROPPATH',
              },
            ],
            initialValue  : this.state.formdefaultvalue['BBPROPPATH']
          })(<Input placeholder="Please input your BBPROPPATH" />)}
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Checkbox checked={this.state.checkNick} onChange={this.handleChange}>
            Nickname is required
          </Checkbox>
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button type="primary" 
          disabled={this.state.isCCBBMigrating}
          ghost={this.state.isCCBBMigrating}
          loading={this.state.isCCBBMigrating}
          onClick={() => {
            const curthis = this ;
            this.setState({isCCBBMigrating : true})
            handleformclick(this.props.form).then(function(){ 
              curthis.setState({isCCBBMigrating : false})
            })

            }
          }>
            {this.state.isCCBBMigrating? '移轉作業執行中' : '開始執行轉換'}
          </Button>
        </Form.Item>
      </div>
    );
  }
}

const WrappedDynamicRule = Form.create({ name: 'dynamic_rule' })(DynamicRule);
export const Ccmiform =  WrappedDynamicRule