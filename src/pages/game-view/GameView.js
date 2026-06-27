import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Helmet } from "react-helmet-async";

import { Header, Main } from "../../components/page";
import { Stats } from "../../components/stats";
import { Button } from "../../components/button";
import { NumberInput } from "../../components/number-input";
import {
  RulesIndex,
  RulesLinksText,
  RulesWithIcon,
  RuleWithIcon,
} from "../../components/rules-index";
import { GeneratedSpells } from "../../components/generated-spells/GeneratedSpells";
import {
  getAllOptions,
  getUnitGeneratedSpellCount,
  getUnitLoresWithSpells,
} from "../../utils/unit";
import { getUnitPoints, getPoints, getAllPoints } from "../../utils/points";
import { useLanguage } from "../../utils/useLanguage";
import { getStats, getUnitName } from "../../utils/unit";
import { editUnit } from "../../state/lists";
import { updateSetting } from "../../state/settings";
import { getGameSystems } from "../../utils/game-systems";
import {
  createBattle,
  addUnitToBattle,
  updateBattleUnit,
  updateVictoryPoints,
  advancePhase,
  selectActiveBattle,
  selectOpponentUnits,
} from "../../state/battle";

import "./GameView.css";

export const GameView = () => {
  const { listId } = useParams();
  const { language } = useLanguage();
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const {
    showPoints,
    showSpecialRules,
    showStats,
    showPageNumbers,
    showVictoryPoints,
    showCustomNotes,
    showGeneratedSpells,
  } = settings;
  const list = useSelector((state) =>
    state.lists.find(({ id }) => listId === id)
  );
  const battle = useSelector(selectActiveBattle);
  const battleId = useSelector((state) => state.battle.activeBattleId);
  const armyComposition = list ? (list.armyComposition || list.army) : null;
  const vpData = battle?.victoryPoints || {};
  const banners = vpData.banners ?? 0;
  const scenarioPoints = vpData.scenarioPoints ?? 0;
  const generalDead = vpData.generalDead ?? false;
  const BSBDead = vpData.BSBDead ?? false;
  const detachmentsDead = vpData.detachmentsDead ?? {};
  const victoryPoints = vpData.units || {};
  const opponentUnits = useSelector(selectOpponentUnits);
  const [showAddOpponent, setShowAddOpponent] = useState(false);
  const [newOpponent, setNewOpponent] = useState({
    name: "", models: 5, wounds: 1, category: "core",
  });
  const handleCustomNoteChange = ({ value, type, unitId }) => {
    dispatch(
      editUnit({
        listId,
        type,
        unitId,
        customNote: value,
      })
    );
  };
  const updateLocalSettings = (newSettings) => {
    localStorage.setItem("owb.settings", JSON.stringify(newSettings));
  };

  const persistedBattle = useSelector((state) => state.battle);

  useEffect(() => {
    if (!list) return;
    if (!persistedBattle.activeBattleId) {
      dispatch(createBattle({ listId, name: list.name }));
    }
  }, [list]);

  useEffect(() => {
    if (!battle) return;
    const battleUnits = Object.keys(battle.ownUnits);
    if (battleUnits.length > 0) return;

    const categories = [
      "characters", "lords", "heroes", "core",
      "special", "rare", "mercenaries", "allies",
    ];
    categories.forEach((category) => {
      (list[category] || []).forEach((unit) => {
        const stats = getStats(unit, armyComposition);
        const woundsPerModel = stats?.[0]?.W
          ? parseInt(stats[0].W, 10)
          : 1;
        dispatch(addUnitToBattle({
          battleId: battle.id,
          side: "own",
          unit: {
            unitListId: unit.id,
            category,
            label: getUnitName({ unit, language }),
            name: getUnitName({ unit, language }),
            strength: unit.strength || unit.minimum || 1,
            woundsPerModel,
          },
        }));
      });
    });
  }, [battle?.id]);

  useEffect(() => {
    localStorage.setItem("owb.battles", JSON.stringify(persistedBattle));
  }, [persistedBattle]);

  if (!list) {
    return (
      <>
        <Header
          to={`/editor/${listId}`}
          headline={intl.formatMessage({
            id: "duplicate.title",
          })}
        />
        <Main />
      </>
    );
  }

  const allPoints = getAllPoints(list);
  const charactersPoints = getPoints({ list, type: "characters" });
  const corePoints = getPoints({ list, type: "core" });
  const specialPoints = getPoints({ list, type: "special" });
  const rarePoints = getPoints({ list, type: "rare" });
  const mercenariesPoints = getPoints({ list, type: "mercenaries" });
  const alliesPoints = getPoints({ list, type: "allies" });
  const gameSystems = getGameSystems();
  const game = gameSystems.find((game) => game.id === list.game);
  const army = game.armies.find((army) => army.id === list.army);
  const armyName = army[`name_${language}`] || army.name_en;
  const getUnitVictoryPoints = (unitId) => {
    let allPoints = 0;
    let detachmentsSum = 0;
    const unitVictoryPoints = victoryPoints[unitId];

    if (unitVictoryPoints && unitVictoryPoints["detachments"]) {
      const detachments = Object.values(unitVictoryPoints["detachments"]);

      if (detachments.length) {
        for (let i = 0; i < detachments.length; i++) {
          detachmentsSum += detachments[i];
        }
      }
    }
    allPoints += unitVictoryPoints ? unitVictoryPoints["25"] : 0;
    allPoints += unitVictoryPoints ? unitVictoryPoints["dead"] : 0;
    allPoints += unitVictoryPoints ? unitVictoryPoints["fleeing"] : 0;
    allPoints += detachmentsSum;

    return allPoints;
  };
  const getAllVictoryPoints = () => {
    let allVictoryPoints =
      banners * 50 +
      scenarioPoints +
      (generalDead ? 100 : 0) +
      (BSBDead ? 50 : 0);

    Object.keys(victoryPoints).forEach((unitId) => {
      allVictoryPoints += getUnitVictoryPoints(unitId);
    });

    return allVictoryPoints;
  };
  const allUnits = [
    ...(list["characters"] || []),
    ...(list["lords"] || []),
    ...(list["heroes"] || []),
    ...(list["core"] || []),
    ...(list["special"] || []),
    ...(list["rare"] || []),
    ...(list["mercenaries"] || []),
    ...(list["allies"] || []),
  ];
  const filters = [
    {
      name: intl.formatMessage({
        id: "export.specialRules",
      }),
      id: "specialRules",
      checked: showSpecialRules,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showSpecialRules: !showSpecialRules,
        });
        dispatch(
          updateSetting({ key: "showSpecialRules", value: !showSpecialRules })
        );
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showStats",
      }),
      id: "stats",
      checked: showStats,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showStats: !showStats,
        });
        dispatch(updateSetting({ key: "showStats", value: !showStats }));
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showPoints",
      }),
      id: "points",
      checked: showPoints,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showPoints: !showPoints,
        });
        dispatch(updateSetting({ key: "showPoints", value: !showPoints }));
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showPageNumbers",
      }),
      id: "pages",
      checked: showPageNumbers,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showPageNumbers: !showPageNumbers,
        });
        dispatch(
          updateSetting({ key: "showPageNumbers", value: !showPageNumbers })
        );
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showCustomNotes",
      }),
      id: "customNotes",
      checked: showCustomNotes,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showCustomNotes: !showCustomNotes,
        });
        dispatch(
          updateSetting({ key: "showCustomNotes", value: !showCustomNotes })
        );
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showGeneratedSpells",
      }),
      id: "generatedSpells",
      checked: showGeneratedSpells,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showGeneratedSpells: !showGeneratedSpells,
        });
        dispatch(
          updateSetting({
            key: "showGeneratedSpells",
            value: !showGeneratedSpells,
          })
        );
      },
    },
    {
      name: intl.formatMessage({
        id: "export.showVictoryPoints",
      }),
      id: "victory",
      checked: showVictoryPoints,
      callback: () => {
        updateLocalSettings({
          ...settings,
          showVictoryPoints: !showVictoryPoints,
        });
        dispatch(
          updateSetting({ key: "showVictoryPoints", value: !showVictoryPoints })
        );
      },
    },
  ];
  const getBattleUnit = (listUnitId) => {
    if (!battle) return null;
    return Object.values(battle.ownUnits).find(
      (u) => u.unitListId === listUnitId
    );
  };

  const getBattleUnitId = (listUnitId) => {
    if (!battle) return null;
    return Object.keys(battle.ownUnits).find(
      (k) => battle.ownUnits[k].unitListId === listUnitId
    );
  };

  const updateOpponentUnit = (unitId, changes) => {
    if (!battle) return;
    dispatch(updateBattleUnit({
      battleId: battle.id, unitId, side: "opponent", changes,
    }));
  };

  const handleAddOpponentUnit = () => {
    if (!battle) return;
    dispatch(addUnitToBattle({
      battleId: battle.id, side: "opponent",
      unit: {
        name: newOpponent.name || "Enemy Unit",
        strength: Number(newOpponent.models) || 5,
        woundsPerModel: Number(newOpponent.wounds) || 1,
        category: newOpponent.category,
      },
    }));
    setNewOpponent({ name: "", models: 5, wounds: 1, category: "core" });
    setShowAddOpponent(false);
  };

  const getSection = ({ type }) => {
    const units = list[type];

    return (
      <ul>
        {units.map((unit, index) => {
          const stats = getStats(unit, armyComposition);
          const unitGeneratedSpellCount = getUnitGeneratedSpellCount(unit);

          return (
            <li key={index} className="list">
              <div className="list__inner game-view__list-inner">
                <h3>
                  {unit.strength || unit.minimum ? (
                    <span className="game-view__strength">
                      {`${unit.strength || unit.minimum} `}
                    </span>
                  ) : null}
                  <span className="game-view__name">
                    <span>{getUnitName({ unit, language })}</span>
                    <RuleWithIcon
                      name={unit.name_en}
                      isDark
                      className="game-view__rule-icon"
                    />
                    {showPoints && (
                      <span className="game-view__points">
                        [
                        {getUnitPoints(unit, {
                          armyComposition,
                        })}{" "}
                        <FormattedMessage id="app.points" />]
                      </span>
                    )}
                  </span>
                </h3>
                <div className="game-view__details">
                  <RulesWithIcon
                    textObject={{
                      name_en: getAllOptions(unit, {
                        language: "en",
                        removeFactionName: false,
                        armyComposition,
                      }),
                      [`name_${language}`]: getAllOptions(unit, {
                        removeFactionName: false,
                        armyComposition,
                      }),
                    }}
                  />
                  {showSpecialRules && unit.specialRules ? (
                    <>
                      <p className="game-view__special-rules">
                        <b>
                          <i>
                            <FormattedMessage id="unit.specialRules" />:
                          </i>
                        </b>{" "}
                        <RulesLinksText
                          textObject={unit.specialRules}
                          showPageNumbers={showPageNumbers}
                        />
                      </p>
                      {unit.detachments &&
                        unit.detachments.map((detachment) => {
                          const specialRulesDetachment =
                            detachment.armyComposition?.[
                              list?.armyComposition || list?.army
                            ]?.specialRules || detachment.specialRules;

                          if (!specialRulesDetachment) {
                            return null;
                          }

                          return (
                            <p
                              className="game-view__special-rules"
                              key={detachment.id}
                            >
                              <b>
                                <i>
                                  <FormattedMessage id="unit.specialRules" /> (
                                  {detachment[`name_${language}`] ||
                                    detachment.name_en}
                                  ):
                                </i>
                              </b>{" "}
                              <RulesLinksText
                                textObject={specialRulesDetachment}
                                showPageNumbers={showPageNumbers}
                              />
                            </p>
                          );
                        })}
                    </>
                  ) : null}
                  {showStats &&
                    (stats?.length > 0 ? (
                      <Stats values={stats} className="game-view__stats" />
                    ) : (
                      <Stats
                        className="game-view__stats"
                        values={[
                          {
                            name: "",
                            M: "",
                            WS: "",
                            BS: "",
                            S: "",
                            T: "",
                            W: "",
                            I: "",
                            A: "",
                            LD: "",
                          },
                        ]}
                      />
                    ))}
                  {showGeneratedSpells && unitGeneratedSpellCount > 0 && (
                    <GeneratedSpells
                      availableLoresWithSpells={getUnitLoresWithSpells(
                        unit,
                        armyComposition
                      )}
                      maxGeneratedSpellCount={unitGeneratedSpellCount}
                      showPageNumbers={showPageNumbers}
                      maxSignatureSpells={unit.maxSignatureSpells}
                    />
                  )}
                  {showCustomNotes && (
                    <div>
                      <label
                        className="game-view__custom-note-label"
                        htmlFor="customNote"
                      >
                        <i>
                          <FormattedMessage id="unit.customNote" />
                        </i>
                      </label>
                      <textarea
                        id="customNote"
                        className="input textarea game-view__custom-note-input"
                        rows="2"
                        value={unit.customNote || ""}
                        onChange={(event) =>
                          handleCustomNoteChange({
                            value: event.target.value,
                            type: type,
                            unitId: unit.id,
                          })
                        }
                        autoComplete="off"
                        maxLength="200"
                      />
                    </div>
                  )}
                  {battle && (
                    <div className="game-view__tracker">
                      <p className="game-view__tracker-title">
                        <FormattedMessage id="misc.battleTracker" />
                      </p>
                      <div className="game-view__tracker-row">
                        <span className="game-view__tracker-label">
                          <FormattedMessage id="misc.models" />:
                        </span>
                        <Button
                          className="game-view__tracker-btn"
                          type="tertiary"
                          onClick={() => {
                            const bu = getBattleUnit(unit.id);
                            if (bu && bu.modelsRemaining > 0) {
                              dispatch(updateBattleUnit({
                                battleId: battle.id,
                                unitId: getBattleUnitId(unit.id),
                                side: "own",
                                changes: { modelsRemaining: bu.modelsRemaining - 1 },
                              }));
                            }
                          }}
                        >–</Button>
                        <span className="game-view__tracker-value">
                          {(() => {
                            const bu = getBattleUnit(unit.id);
                            return bu ? `${bu.modelsRemaining}/${bu.modelsTotal}` : "–";
                          })()}
                        </span>
                        <Button
                          className="game-view__tracker-btn"
                          type="tertiary"
                          onClick={() => {
                            const bu = getBattleUnit(unit.id);
                            if (bu && bu.modelsRemaining < bu.modelsTotal) {
                              dispatch(updateBattleUnit({
                                battleId: battle.id,
                                unitId: getBattleUnitId(unit.id),
                                side: "own",
                                changes: { modelsRemaining: bu.modelsRemaining + 1 },
                              }));
                            }
                          }}
                        >+</Button>
                      </div>
                      <div className="game-view__tracker-row">
                        <span className="game-view__tracker-label">
                          <FormattedMessage id="misc.wounds" />:
                        </span>
                        <Button
                          className="game-view__tracker-btn"
                          type="tertiary"
                          onClick={() => {
                            const bu = getBattleUnit(unit.id);
                            if (bu && bu.woundsRemaining > 0) {
                              dispatch(updateBattleUnit({
                                battleId: battle.id,
                                unitId: getBattleUnitId(unit.id),
                                side: "own",
                                changes: { woundsRemaining: bu.woundsRemaining - 1 },
                              }));
                            }
                          }}
                        >–</Button>
                        <span className="game-view__tracker-value">
                          {(() => {
                            const bu = getBattleUnit(unit.id);
                            return bu ? `${bu.woundsRemaining}/${bu.woundsTotal}` : "–";
                          })()}
                        </span>
                        <Button
                          className="game-view__tracker-btn"
                          type="tertiary"
                          onClick={() => {
                            const bu = getBattleUnit(unit.id);
                            if (bu && bu.woundsRemaining < bu.woundsTotal) {
                              dispatch(updateBattleUnit({
                                battleId: battle.id,
                                unitId: getBattleUnitId(unit.id),
                                side: "own",
                                changes: { woundsRemaining: bu.woundsRemaining + 1 },
                              }));
                            }
                          }}
                        >+</Button>
                      </div>
                      <div className="game-view__tracker-row">
                        {["active", "fleeing", "dead"].map((status) => {
                          const bu = getBattleUnit(unit.id);
                          return (
                            <Button
                              key={status}
                              className="game-view__tracker-btn"
                              type={bu?.status === status ? "secondary" : "tertiary"}
                              onClick={() => {
                                const id = getBattleUnitId(unit.id);
                                if (id) {
                                  dispatch(updateBattleUnit({
                                    battleId: battle.id,
                                    unitId: id,
                                    side: "own",
                                    changes: { status },
                                  }));
                                }
                              }}
                            >
                              <FormattedMessage id={`misc.${status}`} />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {showVictoryPoints && (
                    <div>
                      {getVictoryButtons(unit, type)}
                      <p className="game-view__special-rules">
                        <b>
                          <i>
                            <FormattedMessage id="misc.victoryPoints" />
                            {": "}
                          </i>
                        </b>
                        {getUnitVictoryPoints(unit.id)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  const updateVp = ({ unit, value, deadDetachments }) => {
    if (!battle || !battle.id) return;
    const currentUnits = vpData.units || {};
    let unitPoints = currentUnits[unit.id] || {
      dead: 0,
      fleeing: 0,
      25: 0,
      detachments: {},
    };
    let newGeneralDead = generalDead;
    let newBSBDead = BSBDead;
    let unitDead, unitFleeing;

    switch (value) {
      case "dead": {
        unitDead = unitPoints.dead
          ? 0
          : getUnitPoints(unit, {
              noDetachments: true,
              armyComposition,
            });
        unitPoints = { ...unitPoints, dead: unitDead, fleeing: 0, 25: 0 };
        if (unitPoints.isGeneral) newGeneralDead = Boolean(unitDead);
        if (unitPoints.isBSB) newBSBDead = Boolean(unitDead);
        break;
      }
      case "fleeing": {
        unitFleeing = unitPoints.fleeing
          ? 0
          : Math.round(
              getUnitPoints(unit, {
                noDetachments: true,
                armyComposition,
              }) / 2
            );
        unitPoints = { ...unitPoints, dead: 0, fleeing: unitFleeing, 25: 0 };
        if (unitPoints.isGeneral) newGeneralDead = Boolean(unitFleeing);
        if (unitPoints.isBSB) newBSBDead = Boolean(unitFleeing);
        break;
      }
      case "25": {
        unitPoints = {
          ...unitPoints,
          dead: 0,
          fleeing: 0,
          25: unitPoints["25"]
            ? 0
            : Math.round(
                getUnitPoints(unit, {
                  noDetachments: true,
                  armyComposition,
                }) / 2
              ),
        };
        break;
      }
      case "detachment": {
        unit.detachments.forEach((detachment) => {
          unitPoints = {
            ...unitPoints,
            detachments: {
              ...unitPoints.detachments,
              [detachment.id]:
                deadDetachments *
                getUnitPoints(
                  { ...detachment, strength: 1 },
                  { armyComposition }
                ),
            },
          };
        });
      }
    }

    dispatch(updateVictoryPoints({
      battleId: battle.id,
      vp: {
        units: {
          ...currentUnits,
          [unit.id]: { ...unitPoints, isGeneral: unitPoints.isGeneral ?? false, isBSB: unitPoints.isBSB ?? false },
        },
        generalDead: newGeneralDead,
        BSBDead: newBSBDead,
      },
    }));
  };

  const getVictoryButtons = (unit, type) => {
    return (
      <>
        <Button
          className="game-view__victory-button"
          type={victoryPoints[unit.id]?.dead ? "secondary" : "tertiary"}
          spaceTop
          onClick={() => updateVp({ unit, value: "dead" })}
        >
          <FormattedMessage id="misc.dead" />
        </Button>
        <Button
          className="game-view__victory-button"
          type={victoryPoints[unit.id]?.fleeing ? "secondary" : "tertiary"}
          spaceTop
          onClick={() => updateVp({ unit, value: "fleeing" })}
        >
          <FormattedMessage id="misc.fleeing" />
        </Button>
        <Button
          className="game-view__victory-button"
          type={victoryPoints[unit.id]?.["25"] ? "secondary" : "tertiary"}
          spaceTop
          onClick={() => updateVp({ unit, value: "25" })}
        >
          {"<25%"}
        </Button>
        {unit.detachments &&
          unit.detachments.length &&
          unit.detachments.map((detachment) => (
            <span key={detachment.id} className="game-view__detachment">
              <label
                htmlFor={detachment.id}
                className="game-view__detachment-label"
              >
                <FormattedMessage id="misc.dead" /> {detachment.name_en}
              </label>
              <NumberInput
                id={detachment.id}
                min={0}
                max={detachment.strength}
                value={detachmentsDead[detachment.id] || 0}
                onChange={(event) => {
                  if (battle) {
                    dispatch(updateVictoryPoints({
                      battleId: battle.id,
                      vp: {
                        detachmentsDead: {
                          ...detachmentsDead,
                          [detachment.id]: event.target.value,
                        },
                      },
                    }));
                  }
                  updateVp({
                    unit,
                    value: "detachment",
                    deadDetachments: event.target.value,
                  });
                }}
              />
            </span>
          ))}
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{`Old World Builder | ${list.name}`}</title>
      </Helmet>

      <RulesIndex />

      <Header
        to={`/editor/${listId}`}
        headline={intl.formatMessage({
          id: "misc.gameView",
        })}
        subheadline={`${armyName} [${allPoints} ${intl.formatMessage({
          id: "app.points",
        })}]`}
        filters={filters}
      />

      <Main className="game-view">
        {battle && (
          <section className="game-view__battle-bar">
            <span className="game-view__turn">
              <FormattedMessage id="misc.turn" /> {battle.turn}
            </span>
            <div className="game-view__phases">
              {["strategy", "movement", "shooting", "combat"].map((p) => (
                <span
                  key={p}
                  className={`game-view__phase${battle.phase === p ? " game-view__phase--active" : ""}`}
                >
                  <FormattedMessage id={`phase.${p}`} />
                </span>
              ))}
            </div>
            <Button
              type="primary"
              onClick={() => dispatch(advancePhase({ battleId: battle.id }))}
            >
              <FormattedMessage id="misc.advancePhase" />
            </Button>
          </section>
        )}
        {list.characters.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.characters" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{charactersPoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "characters" })}
          </section>
        )}

        {list.core.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.core" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{corePoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "core" })}
          </section>
        )}

        {list.special.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.special" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{specialPoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "special" })}
          </section>
        )}

        {list.rare.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.rare" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{rarePoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "rare" })}
          </section>
        )}

        {list.allies.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.allies" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{alliesPoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "allies" })}
          </section>
        )}

        {list.mercenaries.length > 0 && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="editor.mercenaries" />{" "}
                {showPoints && (
                  <span className="game-view__points">
                    [{mercenariesPoints} <FormattedMessage id="app.points" />]
                  </span>
                )}
              </h2>
            </header>
            {getSection({ type: "mercenaries" })}
          </section>
        )}

        {battle && (
          <section className="game-view__section game-view__opponent-section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="misc.opponent" />
              </h2>
              <Button
                type="tertiary"
                onClick={() => setShowAddOpponent(!showAddOpponent)}
              >
                {showAddOpponent ? "–" : "+"}
              </Button>
            </header>
            {showAddOpponent && (
              <div className="game-view__add-opponent">
                <div className="game-view__add-opponent-form">
                  <input
                    className="input"
                    placeholder="Unit name"
                    value={newOpponent.name}
                    onChange={(e) => setNewOpponent({ ...newOpponent, name: e.target.value })}
                  />
                  <NumberInput
                    min={1}
                    value={newOpponent.models}
                    onChange={(e) => setNewOpponent({ ...newOpponent, models: e.target.value })}
                  />
                  <NumberInput
                    min={1}
                    value={newOpponent.wounds}
                    onChange={(e) => setNewOpponent({ ...newOpponent, wounds: e.target.value })}
                  />
                  <select
                    className="input"
                    value={newOpponent.category}
                    onChange={(e) => setNewOpponent({ ...newOpponent, category: e.target.value })}
                  >
                    <option value="core">Core</option>
                    <option value="special">Special</option>
                    <option value="rare">Rare</option>
                    <option value="characters">Characters</option>
                  </select>
                </div>
                <div className="game-view__add-opponent-actions">
                  <Button type="primary" onClick={handleAddOpponentUnit}>
                    <FormattedMessage id="misc.add" />
                  </Button>
                  <Button type="tertiary" onClick={() => setShowAddOpponent(false)}>
                    <FormattedMessage id="misc.cancel" />
                  </Button>
                </div>
              </div>
            )}
            {opponentUnits.length === 0 && (
              <p className="game-view__empty">
                <FormattedMessage id="misc.noOpponentUnits" />
              </p>
            )}
            <ul>
              {opponentUnits.map((unit) => (
                <li key={unit.unitListId} className="list">
                  <div className="list__inner game-view__list-inner">
                    <h3>
                      <span className="game-view__name">{unit.label}</span>
                      <span className="game-view__points">
                        [{unit.category}] {unit.modelsRemaining}/{unit.modelsTotal}
                      </span>
                    </h3>
                    <div className="game-view__details">
                      <div className="game-view__tracker">
                        <p className="game-view__tracker-title">
                          <FormattedMessage id="misc.battleTracker" />
                        </p>
                        <div className="game-view__tracker-row">
                          <span className="game-view__tracker-label">
                            <FormattedMessage id="misc.models" />:
                          </span>
                          <Button
                            className="game-view__tracker-btn"
                            type="tertiary"
                            onClick={() => unit.modelsRemaining > 0 && updateOpponentUnit(unit.unitListId, { modelsRemaining: unit.modelsRemaining - 1 })}
                          >–</Button>
                          <span className="game-view__tracker-value">
                            {unit.modelsRemaining}/{unit.modelsTotal}
                          </span>
                          <Button
                            className="game-view__tracker-btn"
                            type="tertiary"
                            onClick={() => unit.modelsRemaining < unit.modelsTotal && updateOpponentUnit(unit.unitListId, { modelsRemaining: unit.modelsRemaining + 1 })}
                          >+</Button>
                        </div>
                        <div className="game-view__tracker-row">
                          <span className="game-view__tracker-label">
                            <FormattedMessage id="misc.wounds" />:
                          </span>
                          <Button
                            className="game-view__tracker-btn"
                            type="tertiary"
                            onClick={() => unit.woundsRemaining > 0 && updateOpponentUnit(unit.unitListId, { woundsRemaining: unit.woundsRemaining - 1 })}
                          >–</Button>
                          <span className="game-view__tracker-value">
                            {unit.woundsRemaining}/{unit.woundsTotal}
                          </span>
                          <Button
                            className="game-view__tracker-btn"
                            type="tertiary"
                            onClick={() => unit.woundsRemaining < unit.woundsTotal && updateOpponentUnit(unit.unitListId, { woundsRemaining: unit.woundsRemaining + 1 })}
                          >+</Button>
                        </div>
                        <div className="game-view__tracker-row">
                          {["active", "fleeing", "dead"].map((status) => (
                            <Button
                              key={status}
                              className="game-view__tracker-btn"
                              type={unit.status === status ? "secondary" : "tertiary"}
                              onClick={() => updateOpponentUnit(unit.unitListId, { status })}
                            >
                              <FormattedMessage id={`misc.${status}`} />
                            </Button>
                          ))}
                          <Button
                            type="tertiary"
                            onClick={() => updateOpponentUnit(unit.unitListId, { status: "dead", modelsRemaining: 0 })}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showVictoryPoints && (
          <section className="game-view__section">
            <header className="editor__header">
              <h2>
                <FormattedMessage id="misc.allVictoryPoints" />
                {": "}
              </h2>
              <strong>
                {getAllVictoryPoints()} <FormattedMessage id="app.points" />
              </strong>
            </header>
            <div className="game-view__victory-points">
              <label htmlFor="banners">
                <FormattedMessage id="misc.banners" />
              </label>
              <NumberInput
                id="banners"
                min={0}
                value={banners}
                onChange={(event) => {
                  if (battle) {
                    dispatch(updateVictoryPoints({
                      battleId: battle.id,
                      vp: { banners: Number(event.target.value) },
                    }));
                  }
                }}
              />
              <label htmlFor="scenarioPoints">
                <FormattedMessage id="misc.scenarioPoints" />
              </label>
              <NumberInput
                id="scenarioPoints"
                min={0}
                value={scenarioPoints}
                onChange={(event) => {
                  if (battle) {
                    dispatch(updateVictoryPoints({
                      battleId: battle.id,
                      vp: { scenarioPoints: Number(event.target.value) },
                    }));
                  }
                }}
              />
              {generalDead && (
                <p>
                  <b>
                    <i>
                      <FormattedMessage id="misc.generalDead" />
                      {": "}
                    </i>
                  </b>
                  100
                </p>
              )}
              {BSBDead && (
                <p>
                  <b>
                    <i>
                      <FormattedMessage id="misc.bsbDead" />
                      {": "}
                    </i>
                  </b>
                  50
                </p>
              )}
              {Object.keys(victoryPoints).map((unitId) => {
                const unit = allUnits.find((unit) => unit.id === unitId);
                const unitVictoryPoints = getUnitVictoryPoints(unitId);

                if (unitVictoryPoints) {
                  return (
                    <p key={unitId}>
                      <b>
                        <i>
                          {getUnitName({ unit, language })}
                          {": "}
                        </i>
                      </b>
                      {unitVictoryPoints}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </section>
        )}
      </Main>
    </>
  );
};
