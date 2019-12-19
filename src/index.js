import React ,{useState} from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import {Ccmiform} from "./ccbbmigrateform.js"

import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Table,
  Divider,
  Tag,
  Button,
  Popconfirm,
  Input ,
  AutoComplete ,
  Progress ,
  Card
} from "antd";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

class CCtobbmi extends React.Component {
  constructor() {
    super();

    // Define the initial state:
    this.state = {
      hasBeenClicked: false,      
      visualcontentlayout: ["NonMigratedLayout", "MigratedLayout"],
      allAvailableSyscode : [],
      migratedSyscode : [],
      migratedsysinfo: [],
      curpageindex : 1 ,
      autocompledataSource : []
    };
  }

   

  handleClick = () => {
    // Update our state here...
  };

  showLayout(layoutname) {
    //let visualcontentlayout = [layoutname]
    let { visualcontentlayout, ...other } = this.state;
    //let newvisualcontentlayout = this.state.visualcontentlayout.filter( (curavilayout) => curavilayout ===  layoutname )
    this.setState({ ...other, visualcontentlayout: [layoutname] });
    //this.setState({visualcontentlayout})
    //alert(this.state)
    console.log(this.state);
  }

  queryMigrateSysInfo() {
    const curapp = this;

    return  fetch(
      "https://deploy.cathaylife.com.tw/ANTWeb/html/api/getCCtoBBMigrateSchedule.jsp"
    )
      .then(function(response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
      })
      .then(function(responsejson) {
        console.log(responsejson);
        let { migratedsysinfo, allAvailableSyscode, migratedSyscode,   ...other } = curapp.state;
        allAvailableSyscode = []
        migratedSyscode = []
        const rejsonwithindex = responsejson.map((eachsysinfo, index) => {
          allAvailableSyscode.push(eachsysinfo.SYSCODE);
          if (eachsysinfo.ISMIGRATED) {
            migratedSyscode.push(eachsysinfo.SYSCODE);
          }
          return { ...eachsysinfo, key: index };
        });

        curapp.setState({ ...other, allAvailableSyscode, migratedSyscode,   migratedsysinfo: rejsonwithindex });
        console.log(curapp.state);
      })
      .catch(function(err) {
        alert(err);
      });
  }

  filterBySyscode(filteredsyscode) {
    const curapp = this;
    //alert('Filter condition : ' + filteredsyscode);
    this.queryMigrateSysInfo()
    .then(function(){
      let { migratedsysinfo, ...other } = curapp.state;
    
      const filterList = migratedsysinfo.filter(
        (oneSySInfo) => {
          return oneSySInfo.SYSCODE.trim().toUpperCase() === filteredsyscode.trim().toUpperCase()
        }
      )
      curapp.setState({ ...other, migratedsysinfo: filterList });
    })
  }

  filterBySyscodeKey(inputsysKey) {
    console.log('inputsysKey : ' + inputsysKey)
    const curapp = this;
    let { autocompledataSource, allAvailableSyscode, migratedsysinfo, ...other } = curapp.state;
    let newautocompledataSource = [];

    // migratedsysinfo.forEach(
    //   (oneSySInfo) => {
    //     if ( oneSySInfo.SYSCODE.trim().toUpperCase().startsWith(inputsysKey.trim().toUpperCase()) ){
    //       newautocompledataSource.push(oneSySInfo.SYSCODE)
    //     }
    //   }
    // )

    allAvailableSyscode.forEach(
      (oneSySInfo) => {
        if ( oneSySInfo.trim().toUpperCase().startsWith(inputsysKey.trim().toUpperCase()) ){
          newautocompledataSource.push(oneSySInfo)
        }
      }
    )


    curapp.setState({ ...other, migratedsysinfo, autocompledataSource : newautocompledataSource });
  }


  sayhi(whoyouare) {
    //alert ('HIHI ' + whoyouare);
    fetch(
      "https://deploy.cathaylife.com.tw/ANTWeb/html/api/getSerialnoOwnerAndSupporterInfo.jsp?element=191107000997"
    )
      .then(function(response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        return response.blob();
      })
      .then(function(responseblob) {
        responseblob.text().then(function(text) {
          alert(text);
        });
      })
      .catch(function(err) {
        alert(err);
      });
  }

  handlepagechange(page, pageSize){
    //console.log(page + ',' + pageSize)
    let { curpageindex, ...other } = this.state;
    this.setState({...other, 'curpageindex' : page})
  }

  addSystoMigratedList(syscode) {
    const curapp = this;

    fetch(
      "https://deploy.cathaylife.com.tw/ANTWeb/html/api/addSysycodeToMigratedList.jsp?element=" + syscode
    )
      .then(function(response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        return response.blob();
      })
      .then(function(responsejson) {
        //console.log(responsejson);
        alert('標註已完成 : ' + syscode)
        curapp.queryMigrateSysInfo()
      })
      .catch(function(err) {
        alert(err);
      });
  }

  handlemigrateclick (migratedform){
    //alert('click');
    migratedform.validateFields(err => {
      if (err) {
        console.info(err);
        return;
      }
    });
    console.log(migratedform.getFieldsValue())
    return fetch(
      "https://10.180.104.108/cctobb/html/writeccbbprop.jsp?element=" + JSON.stringify(migratedform.getFieldsValue())
    )
      .then(function(response) {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        return response.blob();
      })
      .then(function(responsejson) {
        //console.log(responsejson);
        //alert('標註已完成 : ' + syscode)
        responsejson.text().then(function(text) {
          console.log(text);
        });
        
      })


    //alert(migratedform.getFieldsValue());
  }
  
 columns = [
  {
    title: "項目",
    dataIndex: "syscodeindex",
    key: "syscodeindex",
    align: "center",
    render: (text, record, index) => <a>{(this.state.curpageindex - 1) * 10 + index + 1   }</a>
  },
  {
    title: "系統代號",
    dataIndex: "SYSCODE",
    key: "SYSCODE",
    align: "center",
    render: text => <a>{text}</a>
  },
  {
    title: "系統名稱",
    dataIndex: "SYSNAME",
    key: "SYSNAME",
    align: "center",
    render: text => <a>{text}</a>
  },
  {
    title: "系統平台",
    dataIndex: "PLATFORM",
    key: "PLATFORM",
    align: "center"
  },
  {
    title: "完成移轉",
    dataIndex: "ISMIGRATED",
    key: "ISMIGRATED",
    align: "center",
    filters: [
      {
        text: '已移轉',
        value: true,
      },
      {
        text: '未移轉',
        value: false,
      },
    ],
    onFilter: (value, record) => record.ISMIGRATED === value,
    filterMultiple: false,
    sorter: (a, b) =>  {
      //console.log(a); 
      return (a.ISMIGRATED === b.ISMIGRATED)? 0 : a.ISMIGRATED? -1 : 1;
      
    } ,
    sortDirections: ["descend", "ascend"],
    render: (text, record) => (
      <span>
        {text ? <Tag color="geekblue"> Y </Tag> : <Tag color="red"> N </Tag>}
      </span>
    )
  },

  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <a>Invite {record.age}</a>
        <Divider type="vertical" />
        {
          record.ISMIGRATED ?  
          (<Button type="danger" shape="round" icon="exclamation" >
          標註未移轉 </Button>)
        :  (
          <Popconfirm
            title="是否確定標註為已移轉?"
            okText="Yes"
            cancelText="No"
            onConfirm={ () =>this.addSystoMigratedList(record.SYSCODE)}
          >
            <Button type="primary" shape="round" icon="check"  >
            標註已移轉 </Button>
          </Popconfirm>
        )
        }

      </span>
    )
  }
];

  render() {
    return (
      <div>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item
                key="1"
                onClick={() => {
                  this.showLayout("ExecuteMigrateForm");
                }}
              >
                進行轉換程序
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => {
                  this.showLayout("MigratedLayout");
                }}
              >
                移轉系統進度
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: "#fff" }}>
            <div style={{margin : "20px", padding : "0px"}}>
            {/* <Card size="small" 
              title="移轉完成比" 
              bordered={true}
              actions={[
                <Progress type="circle" percent={30} width={80} />
              ]}
            > 
            </Card> */}
            移轉完成比
            <Divider type="vertical" />
            <Progress type="circle" percent={ Math.round(this.state.migratedSyscode.length / this.state.allAvailableSyscode.length * 100 *100) /100  } width={60} />   
            </div>
            
                
            </Sider>
            <Layout
              style={{
                padding: "0 24px 24px",
                display: this.state.visualcontentlayout.includes(
                  "MigratedLayout"
                )
                  ? "block"
                  : "none"
              }}
            >
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content
                style={{
                  background: "#fff",
                  padding: 20,
                  margin: 0,
                  minHeight: 280
                }}
              >
                <div>
                <Button
                  type="primary"
                  icon="poweroff"
                  loading={false}
                  onClick={() => {
                    this.queryMigrateSysInfo();
                  }}
                >
                  Sync eForm
                </Button>
                <Divider type="vertical" />
                <AutoComplete
                  dataSource={this.state.autocompledataSource}
                  onSearch={(serval)=> this.filterBySyscodeKey(serval)}
                  onSelect={value => this.filterBySyscode(value)}
                >
                  <Search
                    placeholder="輸入子系統代號過濾" 
                    onSearch={value => this.filterBySyscode(value)}
                    style={{ width: 200 }}
                  />
                </AutoComplete>
                </div>
                <Table
                  pagination={{onChange : this.handlepagechange.bind(this) }}
                  columns={this.columns}
                  dataSource={this.state.migratedsysinfo}
                  onRow={(record, index) => {
                   // console.log(index  + ',' + record)
                  }}
                />
              </Content>
            </Layout>
            <Layout
              style={{
                padding: "0 24px 24px",
                display: this.state.visualcontentlayout.includes(
                  "ExecuteMigrateForm"
                )
                  ? "block"
                  : "none"
              }}
            >
              <Ccmiform handchkclick={this.handlemigrateclick} /> 
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}


const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  },
  {
    key: "4",
    name1: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
];

ReactDOM.render(<CCtobbmi />, document.getElementById("container"));
