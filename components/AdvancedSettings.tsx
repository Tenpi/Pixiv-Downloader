import {ipcRenderer} from "electron"
import React, {useContext, useEffect, useRef, useState} from "react"
import {Dropdown, DropdownButton} from "react-bootstrap"
import {TemplateContext, FolderMapContext, SortContext, TargetContext, IllustLimitContext, MangaLimitContext, UgoiraLimitContext, TranslateTitlesContext, RestrictContext, MoeContext, BookmarksContext} from "../renderer"
import functions from "../structures/functions"
import "../styles/advancedsettings.less"

const AdvancedSettings: React.FunctionComponent = (props) => {
    const {template, setTemplate} = useContext(TemplateContext)
    const {folderMap, setFolderMap} = useContext(FolderMapContext)
    const {illustLimit, setIllustLimit} = useContext(IllustLimitContext)
    const {mangaLimit, setMangaLimit} = useContext(MangaLimitContext)
    const {ugoiraLimit, setUgoiraLimit} = useContext(UgoiraLimitContext)
    const {sort, setSort} = useContext(SortContext)
    const {target, setTarget} = useContext(TargetContext)
    const {translateTitles, setTranslateTitles} = useContext(TranslateTitlesContext)
    const {restrict, setRestrict} = useContext(RestrictContext)
    const {moe, setMoe} = useContext(MoeContext)
    const {bookmarks, setBookmarks} = useContext(BookmarksContext)
    const [visible, setVisible] = useState(false)
    const [cookieDeleted, setCookieDeleted] = useState(false)

    useEffect(() => {
        const showSettingsDialog = (event: any, update: any) => {
            setVisible((prev) => !prev)
        }
        const closeAllDialogs = (event: any, ignore: any) => {
            if (ignore !== "settings") setVisible(false)
        }
        ipcRenderer.on("show-settings-dialog", showSettingsDialog)
        ipcRenderer.on("close-all-dialogs", closeAllDialogs)
        initSettings()
        return () => {
            ipcRenderer.removeListener("show-settings-dialog", showSettingsDialog)
            ipcRenderer.removeListener("close-all-dialogs", closeAllDialogs)
        }
    }, [])

    const initSettings = async () => {
        const settings = await ipcRenderer.invoke("init-settings")
        if (settings) {
            if (settings.template) setTemplate(settings.template)
            if (settings.folderMap) setFolderMap(settings.folderMap)
            if (settings.sort) setSort(settings.sort)
            if (settings.target) setTarget(settings.target)
            if (settings.illustLimit) setIllustLimit(settings.illustLimit)
            if (settings.mangaLimit) setMangaLimit(settings.mangaLimit)
            if (settings.ugoiraLimit) setUgoiraLimit(settings.ugoiraLimit)
            if (settings.translateTitles) setTranslateTitles(settings.translateTitles)
            if (settings.restrict) setRestrict(settings.restrict)
            if (settings.moe) setMoe(settings.moe)
            if (settings.bookmarks) setBookmarks(settings.bookmarks)
        }
    }

    useEffect(() => {
        ipcRenderer.invoke("store-settings", {template, folderMap, sort, target, restrict, illustLimit, mangaLimit, ugoiraLimit, translateTitles, moe, bookmarks})
        functions.logoDrag(!visible)
    })

    const ok = () => {
        functions.logoDrag(true)
        setVisible(false)
    }

    const revert = () => {
        setTemplate("{title}*_p{page}*")
        setFolderMap("")
        setSort("date_desc")
        setTarget("partial_match_for_tags")
        setRestrict("public")
        setIllustLimit(100)
        setMangaLimit(25)
        setUgoiraLimit(10)
        setTranslateTitles(false)
        setMoe(false)
        setBookmarks(0)
    }

    const changeTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setTemplate(value)
    }

    const changeFolderMap = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setFolderMap(value)
    }

    const changeIllustLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setIllustLimit(value)
    }

    const changeIllustLimitKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setIllustLimit((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setIllustLimit((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeMangaLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setMangaLimit(value)
    }

    const changeMangaLimitKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setMangaLimit((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setMangaLimit((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeUgoiraLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setUgoiraLimit(value)
    }

    const changeUgoiraLimitKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setUgoiraLimit((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setUgoiraLimit((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const deleteCookie = () => {
        ipcRenderer.invoke("delete-cookies")
        setCookieDeleted(true)
        setTimeout(() => {setCookieDeleted(false)}, 2000)
    }

    if (visible) {
        return (
            <section className="settings-dialog">
                <div className="settings-dialog-box">
                    <div className="settings-container">
                        <div className="settings-title-container">
                            <p className="settings-title">Advanced Settings</p>
                        </div>
                        <div className="settings-row-container">
                            <div className="settings-row">
                                <p className="settings-text">Output: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={template} onChange={changeTemplate}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Folder Map: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={folderMap} onChange={changeFolderMap}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Sort: </p>
                                <DropdownButton title={sort} drop="down">
                                    <Dropdown.Item active={sort === "date_desc"} onClick={() => setSort("date_desc")}>date_desc</Dropdown.Item>
                                    <Dropdown.Item active={sort === "date_asc"} onClick={() => setSort("date_asc")}>date_asc</Dropdown.Item>
                                    <Dropdown.Item active={sort === "popular_desc"} onClick={() => setSort("popular_desc")}>popular_desc</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Target: </p>
                                <DropdownButton title={target} drop="down">
                                    <Dropdown.Item active={target === "partial_match_for_tags"} onClick={() => setTarget("partial_match_for_tags")}>partial_match_for_tags</Dropdown.Item>
                                    <Dropdown.Item active={target === "title_and_caption"} onClick={() => setTarget("title_and_caption")}>title_and_caption</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Restrict: </p>
                                <DropdownButton title={restrict} drop="down">
                                    <Dropdown.Item active={restrict === "public"} onClick={() => setRestrict("public")}>public</Dropdown.Item>
                                    <Dropdown.Item active={restrict === "private"} onClick={() => setRestrict("private")}>private</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Bookmarks: </p>
                                <DropdownButton title={bookmarks} drop="down">
                                    <Dropdown.Item active={bookmarks === 0} onClick={() => setBookmarks(0)}>0</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 50} onClick={() => setBookmarks(50)}>50</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 100} onClick={() => setBookmarks(100)}>100</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 300} onClick={() => setBookmarks(300)}>300</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 500} onClick={() => setBookmarks(500)}>500</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 1000} onClick={() => setBookmarks(1000)}>1000</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 3000} onClick={() => setBookmarks(3000)}>3000</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 5000} onClick={() => setBookmarks(5000)}>5000</Dropdown.Item>
                                    <Dropdown.Item active={bookmarks === 10000} onClick={() => setBookmarks(10000)}>10000</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Illust Limit: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={illustLimit} onChange={changeIllustLimit} onKeyDown={changeIllustLimitKey}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Manga Limit: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={mangaLimit} onChange={changeMangaLimit} onKeyDown={changeMangaLimitKey}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Ugoira Limit: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={ugoiraLimit} onChange={changeUgoiraLimit} onKeyDown={changeUgoiraLimitKey}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Translate Titles:</p>
                                <input className="settings-checkbox" type="checkbox" checked={translateTitles} onClick={() => setTranslateTitles((prev: boolean) => !prev)}/>
                            </div>
                            <div className="settings-row">
                                <p className="settings-text">Pixiv.moe:</p>
                                <input className="settings-checkbox" type="checkbox" checked={moe} onClick={() => setMoe((prev: boolean) => !prev)}/>
                            </div>
                            <div className="settings-row">
                                <button onClick={deleteCookie} className="cookie-button">Delete Cookies</button>
                                {cookieDeleted ? <p className="cookie-text">Deleted!</p> : null}
                            </div>
                        </div>
                        <div className="settings-button-container">
                         <button onClick={revert} className="revert-button">Revert</button>
                            <button onClick={ok} className="ok-button">Ok</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    return null
}

export default AdvancedSettings