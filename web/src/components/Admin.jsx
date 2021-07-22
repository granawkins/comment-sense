import { Link, useRouteMatch, Switch, Route } from 'react-router-dom';

import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import { withStyles } from '@material-ui/core/styles'

import BlogEditor from './Admin/BlogEditor';
import Logs from './Admin/Logs';

const drawerWidth = 240

const styles = (theme) => ({
    root: {
        zIndex: 1,
        display: 'flex',
    },
    drawer: {
        zIndex: 1,
        flexShrink: 0,
        width: drawerWidth,
    },
    drawerPaper: {
        zIndex: 1,
        width: drawerWidth,
    },
    drawerContainer: {
        zIndex: 1,
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        margin: '10px',
    }
})

const Admin = ({classes}) => {

    // A drawer with two tabs: quota and blog
    const { path, url } = useRouteMatch()

    return(
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                anchor="left"
                className={classes.drawer}
                classes={{paper: classes.drawerPaper}}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                    {['Blog', 'Logs'].map((page) => (
                        <ListItem button key={page}>
                            <Link to={`/admin/${page}`}>
                                <ListItemText primary={page} />
                            </Link>
                        </ListItem>
                    ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Switch>
                    <Route exact path='/admin'>
                        <Typography>Please select a section.</Typography>
                    </Route>
                    <Route exact path={`/admin/blog`}>
                        <BlogEditor />
                    </Route>
                    <Route exact path={`/admin/logs`}>
                        <Logs />
                    </Route>
                </Switch>
            </main>
        </div>
    )
}

export default withStyles(styles)(Admin)
