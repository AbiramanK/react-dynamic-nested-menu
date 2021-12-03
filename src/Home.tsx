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

const { SubMenu } = Menu;
const { Option } = Select;
const { Title } = Typography;

interface IHomeProps {
}

interface MenuItemType {
    name: string;
    children?: Array<MenuItemType>;
}

const Home: FunctionComponent<IHomeProps> = (props) => {

    const [menuData, setMenuData] = useState([
        {
            name: 'PMenu1',
            children: [
                {
                    name: 'CMenu11',
                    children: [
                        {
                            name: 'CCMenu12',
                            children: [
                                {
                                    name: 'CCMenu13',
                                },
                            ]
                        },
                    ],
                },
            ],
        },
        {
            name: 'PMenu2',
        },
        {
            name: 'PMenu3',
            children: [
                {
                    name: 'CMenu31',
                },
                {
                    name: 'CMenu32',
                },
                {
                    name: 'CMenu33',
                },
                {
                    name: 'CMenu34',
                },
            ],
        },
        {
            name: 'Pmenu4',
        },
    ]);

    const [parentMenuOptions, setParentMenuOptions] = useState([""]);
    const [form] = Form.useForm();

    useEffect(() => {
        createParentMenu();
    }, [menuData])

    const handleClick = (e: any) => {
        message.success(`${e.key} clicked`);
    }

    const handleNestedMenu = (menus: Array<MenuItemType>) => {

        return menus.map((menu: MenuItemType, index: number) => {
            if (!menu.children) {
                return <Menu.Item key={`${menu.name}`}>{menu.name}</Menu.Item>;
            }

            return (
                <SubMenu key={`${menu.name}`} title={`${menu.name}`}>
                    {handleNestedMenu(menu.children)}
                </SubMenu>
            );
        });
    }

    const onFinish = (values: any) => {
        if(parentMenuOptions.includes(values.categoryName)) {
            message.error("Menu name already exist, try different menu name");
        } else {
            addMenuItem({
                parentCategory: values.parentCategory,
                categoryName: values.categoryName
            })
            message.success(`${values.categoryName} menu added in ${values.parentCategory}`);
            onReset();
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const addMenuItem = (category: { parentCategory: string | any, categoryName: string | any }) => {

        const insertMenu = (data: Array<MenuItemType> | any) => {
            return data.map((menu: MenuItemType, index: number) => {
                if (!menu.children) {
                   if(menu.name === category.parentCategory) {
                       menu.children = [
                           {
                               name: category.categoryName
                           }
                       ]
                   }

                   console.log("menu items", menu)

                   return menu;
                }
                if(menu.children) {
                    if(menu.name === category.parentCategory) {
                        menu.children.push(
                            {
                                name: category.categoryName
                            }
                        );
                    }
                    let tempMenu = {
                        name: menu.name,
                        children: insertMenu(menu.children)
                    };
                    console.log("temp menu", tempMenu)
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
                    menuOptions.push(menu.name);
                }
                if (menu.children) {
                    menuOptions.push(menu.name);
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
                                {parentMenuOptions && parentMenuOptions.map((category: string, index: number) => {
                                    return (
                                        <Option key={index} value={`${category}`}>{category}</Option>
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
