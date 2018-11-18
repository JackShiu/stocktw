import React, { Component } from "react";
import { displayList as listTypeInfoList} from './ListTypeInfoHelper'
import  ListTypeInfoItem  from "./ListTypeInfoItem";
import { rankObj } from '../utils/rankList';

import {
    Table,
} from "react-bootstrap";

class ListTypeInfo extends Component {
    constructor(props){
        super(props);
    }

    getCategory = () =>(
        <tr key='thead-tr-1'>
            {Object.keys(listTypeInfoList).map(title => {
                let col = listTypeInfoList[title].length;
                return <th key={title} colSpan={col}>
                    {title}
                </th>;
            })}
        </tr>
    )
    getTitle = () => (
        <tr style={{backgroundColor: 'grey'}} key='thead-tr-2'>
            {Object.keys(listTypeInfoList).reduce((acc, title) => {
                let item = listTypeInfoList[title].map((obj, i) => (
                    <th key={title + "-tr-" + i}>{obj.name}</th>
                ));
                return acc.concat(item);
            }, [])}
        </tr>
    )

    render(){
        let { mStockInfoManager, mKeywordList, R_module} =this.props;
        let rankFilter;
        rankObj.map(obj =>{
            if(obj.name === R_module && obj.filter){
                rankFilter = obj.filter.bind(this)
            }
            console.log(rankFilter)
        })
        return (<div>
            <div style={{ marginBottom: "4rem" }} />
            {/* list  */}
            <Table striped bordered condensed hover responsive>
                <thead>
                    {this.getCategory()}
                    {this.getTitle()}
                </thead>
                <tbody>
                    {mStockInfoManager
                        .getRankList()
                    [R_module].filter(id => {
                        let info = mStockInfoManager.getInfobyID(id);
                        if (rankFilter != undefined && !rankFilter(info)){
                            return false;
                        }
                        if (!mKeywordList.length) {
                            return true;
                        }
                        let { keywords } = info;
                        let isContain = false;
                        mKeywordList.forEach(item => {
                            if (keywords.includes(item)) isContain = true;
                        });
                        return isContain;
                    })
                    .slice(0, 200)
                    .map((id, index) => {
                        let item = <ListTypeInfoItem key={id} id={id} rank={index} {...this.props} />;
                        if(index!= 0 && index%10 ===0 ) {
                            return [item, this.getTitle()];
                        }
                        return item;
                    })}
                </tbody>
            </Table>
        </div>)
    }
}


export default ListTypeInfo;