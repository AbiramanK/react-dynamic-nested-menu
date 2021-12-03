import React, {
    FunctionComponent,
    useEffect,
    useState
} from 'react';
import {
    Menu,
    Card,
    Select,
    Form,
    Input,
    Button,
    Typography,
    message
} from "antd";
import { v4 as uuidv4 } from 'uuid';

const { SubMenu } = Menu;
const { Option } = Select;
const { Title } = Typography;

interface IHomeProps {
}

interface MenuItemType {
    name: string;
    id: string;
    children?: Array<MenuItemType>;
}

const Home: FunctionComponent<IHomeProps> = (props) => {

    const [menuData, setMenuData] = useState([
        {
            name: 'PMenu1',
            id: uuidv4(),
            children: [
                {
                    name: 'CMenu11',
                    id: uuidv4(),
                    children: [
                        {
                            name: 'CCMenu12',
                            id: uuidv4(),
                            children: [
                                {
                                    name: 'CCMenu13',
                                    id: uuidv4()
                                },
                            ]
                        },
                    ],
                },
            ],
        },
        {
            name: 'PMenu2',
            id: uuidv4()
        },
        {
            name: 'PMenu3',
            id: uuidv4(),
            children: [
                {
                    name: 'CMenu31',
                    id: uuidv4()
                },
                {
                    name: 'CMenu32',
                    id: uuidv4()
                },
                {
                    name: 'CMenu33',
                    id: uuidv4()
                },
                {
                    name: 'CMenu34',
                    id: uuidv4()
                },
            ],
        },
        {
            name: 'Pmenu4',
            id: uuidv4()
        },
    ]);

    const [parentMenuOptions, setParentMenuOptions] = useState([""]);
    const [form] = Form.useForm();

    useEffect(() => {
        createParentMenu();
    }, [menuData])

    const handleClick = (e: any) => {
        message.success(`${e.key.split('_')[1]} clicked`);
    }

    const handleNestedMenu = (menus: Array<MenuItemType>) => {

        return menus.map((menu: MenuItemType, index: number) => {
            if (!menu.children) {
                return <Menu.Item key={`${menu.id}_${menu.name}`}>{menu.name}</Menu.Item>;
            }

            return (
                <SubMenu key={`${menu.id}_${menu.name}`} title={`${menu.name}`}>
                    {handleNestedMenu(menu.children)}
                </SubMenu>
            );
        });
    }

    const onFinish = (values: any) => {
        addMenuItem({
            parentCategory: values.parentCategory,
            categoryName: values.categoryName,
            id: uuidv4()
        })
        message.success(`${values.categoryName} menu added in ${values.parentCategory.split('_')[1]}`);
        onReset();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const addMenuItem = (category: { parentCategory: string | any, categoryName: string | any, id: string | any }) => {

        const insertMenu = (data: Array<MenuItemType> | any) => {
            return data.map((menu: MenuItemType, index: number) => {
                if (!menu.children) {
                   if(menu.id === category.parentCategory.split('_')[0]) {
                       menu.children = [
                           {
                               name: category.categoryName,
                               id: uuidv4()
                           }
                       ]
                   }

                   return menu;
                }
                if(menu.children) {
                    if(menu.id === category.parentCategory.split('_')[0]) {
                        menu.children.push(
                            {
                                name: category.categoryName,
                                id: uuidv4()
                            }
                        );
                    }
                    let tempMenu = {
                        name: menu.name,
                        id: category.id,
                        children: insertMenu(menu.children)
                    };

                    return tempMenu;
                }
            });
        }

        let updatedMenu = insertMenu(menuData);

        setMenuData(updatedMenu);
    }

    const createParentMenu = () => {
        const menuOptions: any = [];
        const insertMenu = (data: Array<MenuItemType> | any) => {
            
            data.map((menu: MenuItemType, index: number) => {
                if (!menu.children) {
                    menuOptions.push({
                        name: menu.name,
                        id: menu.id
                    });
                }
                if (menu.children) {
                    menuOptions.push({
                        name: menu.name,
                        id: menu.id
                    });
                    insertMenu(menu.children);
                }
            });
        }

        insertMenu(menuData);

        setParentMenuOptions(menuOptions);
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#DDCBFB',
                    height: "100vh"
                }}
            >
                <Menu
                    onClick={handleClick}
                    mode="horizontal"
                    style={{
                        width: "80%",
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingInlineEnd: 180,
                        marginTop: 80
                    }}
                >
                    {handleNestedMenu(menuData)}
                </Menu>
                <Card
                    style={{
                        width: 400,
                        marginTop: 85,
                        paddingInline: 30
                    }}
                >
                    <Title style={{ textAlign: 'center' }} level={2} >Add a New Category</Title>
                    <Form
                        name="categoryForm"
                        layout={`vertical`}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        style={{
                            marginTop: 30
                        }}
                        form={form}
                    >
                        <Form.Item
                            label="Category Name"
                            name="categoryName"
                            rules={[{ required: true, message: 'Please input Category Name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Parent Category"
                            name="parentCategory"
                            rules={[{ required: true, message: 'Please Choose a Parent Category!' }]}
                        >
                            <Select
                                placeholder="Choose a Parent"
                            >
                                {parentMenuOptions && parentMenuOptions.map((category: any, index: number) => {
                                    return (
                                        <Option key={index} value={`${category.id}_${category.name}`}>{category.name}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                style={{
                                    backgroundColor: '#B981F0',
                                    width: "100%",
                                    borderWidth: 0
                                }}
                                type="primary"
                                color="#FFFFFF"
                                htmlType="submit"
                                size="large"
                            >Add Category</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Home;
