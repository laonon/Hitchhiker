import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Menu, Icon } from 'antd';
import { DtoResCollection, DtoResRecord } from '../../../api/interfaces/dto_res';
import { fetchCollection } from '../actions/collections';
import { State } from '../state';
import './collection_tree/index.less';

const SubMenu = Menu.SubMenu;

interface CollectionListStateProps {
    collections: DtoResCollection[];
}

interface CollectionListDispatchProps {
    refresh: Function;
}

type CollectionListProps = CollectionListStateProps & CollectionListDispatchProps;

interface CollectionListState {
    openKeys: string[];
}

class CollectionList extends React.Component<CollectionListProps, CollectionListState> {
    refresh: Function;

    constructor(props: CollectionListProps) {
        super(props);
        this.refresh = props.refresh;
        this.state = {
            openKeys: [],
        };
    }

    componentWillMount() {
        this.refresh();
    }

    onOpenChanged = (openKeys: string[]) => {
        this.setState({ openKeys: openKeys });
    }

    render() {
        const { collections } = this.props;

        const loopRecords = (data: DtoResRecord[]) => data.map(r => {
            if (r.children && r.children.length) {
                return <SubMenu key={r.id} title={<span><Icon className="c-icon" type={this.state.openKeys.indexOf(r.id) > -1 ? "folder-open" : "folder"} /><span>{r.name}</span></span>}>{loopRecords(r.children)}</SubMenu>;
            }
            return <Menu.Item key={r.id}>{r.name}</Menu.Item>;
        });

        const subMenuStyle = {
            padding: '0px'
        }

        return (
            <Menu
                className="collection-tree"
                style={{ width: 240 }}
                /*defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}*/
                onOpenChange={this.onOpenChanged}
                mode="inline"
                inlineIndent={0}
            >
                {
                    collections.map(c => {
                        return (
                            <SubMenu style={subMenuStyle} key={c.id} title={<span><Icon type="wallet" className="c-icon" /><span>{c.name}</span></span>}>
                                {loopRecords(c.records)}
                            </SubMenu>
                        );
                    })
                }
            </Menu>
        );
    }
}

const mapStateToProps = (state: State): CollectionListStateProps => {
    return {
        collections: state.collections
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): CollectionListDispatchProps => {
    return {
        refresh: () => dispatch(fetchCollection())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CollectionList);