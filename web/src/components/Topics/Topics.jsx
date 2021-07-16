import { useState, useEffect, useRef } from 'react'
import { withStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import TopicCard from './TopicCard.jsx'
import LoadingCircle from '../../utils/LoadingCircle.js'
import { postData } from '../../utils/helpers.js'

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'nowrap',
        backgroundColor: '#f5f5f5',
        margin: '0',
        padding: '10px 0',
    },
    loading: {
        margin: '20px 0',
    },
    error: {
        width: '100%',
        textAlign: 'center',
        color: 'gray',
        padding: '20px',
        fontWeight: '400',
    }
})

const Topics = ({videoId, commentsAnalyzed, topics, loading, classes}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [isEnd, setIsEnd] = useState(false)
    const [topicsFeed, setTopicsFeed] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const loader = useRef(null)
    
    const [maxScore, setMaxScore] = useState(0)
    const addToFeed = (items) =>  {
        console.log(items)
        let newItems = []
        if (items.length === 0) {
            setIsEnd(true)
            return
        }
        let newMax = Math.max(maxScore, items[0].score)
        setMaxScore(newMax)

        newItems = items.map(t => <TopicCard topic={t} max={newMax} key={t.token} />)
        setTopicsFeed(oldItems => [...oldItems, newItems])
    }

    const handleLoad = async () => {
        if (isEnd) {
            return
        }
        setIsLoading(true)
        try {
            let apiRef = '/api/topics'
            let data = {
                videoId: videoId,
                page: pageNumber,
            }
            let result = await postData(apiRef, data)
            let newItems = JSON.parse(result.topics)
            addToFeed(newItems)
            setIsLoading(false)
        }
        catch (err) {
            console.log(`Error loading new topics.`)
            setIsLoading(false)
            setHasError(true)
        }
    }

    // Add new topics when scroll to bottom
    useEffect(() => {
        if (pageNumber > 0) {
            handleLoad()
        }
    }, [pageNumber])

    const handleObserver = (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isLoading) {
            setPageNumber((p) => p + 1)
        }
    }


    // Rebuild the feed whenever new comments are added to db
    let [observer, setObserver] = useState(null)
    useEffect(() => {
        if (commentsAnalyzed > 0) {
            // Empty current feed
            setTopicsFeed([])
            setPageNumber(0)

            // Connect observer if not yet connected
            if (!observer) {
                const option = {
                    root: null,
                    rootMargin: "20px",
                    threshold: 0
                };
                let newObserver = new IntersectionObserver(handleObserver, option);
                if (loader.current) newObserver.observe(loader.current);
                setObserver(newObserver)
            }
        } else {
            if (observer) {
                observer.unobserve(loader.current)
            }
        }
    }, [commentsAnalyzed])

    return (
        <div className='root'>
            {topicsFeed}
            <div ref={loader} />
            {loading ? <div className={classes.loading}><LoadingCircle /></div> : null}
            {hasError ? <Typography className={classes.error}>ERROR</Typography> : null}
            {isEnd ? <Typography className={classes.error}>END OF TOPICS</Typography> : null}
        </div>
    )
}

export default withStyles(styles)(Topics)
